import os
from dotenv import load_dotenv
import time
import requests
import streamlit as st
from typing import Dict, Tuple
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline

class FeedbackGenerator:
    def __init__(self):
        load_dotenv()
        # Initialize Hugging Face pipeline for text generation
        try:
            self.generator = pipeline('text-generation', 
                                   model='gpt2',
                                   max_length=100)
            self.classifier = pipeline('sentiment-analysis',
                                    model='distilbert-base-uncased-finetuned-sst-2-english')
        except Exception as e:
            st.error(f"Error initializing models: {str(e)}")
            self.generator = None
            self.classifier = None

        try:
            nltk.download('vader_lexicon', quiet=True)
            self.sia = SentimentIntensityAnalyzer()
        except Exception as e:
            st.error(f"Error initializing NLTK: {str(e)}")
            self.sia = None

        self.eco_templates = {
            'generic': [
                "Using reusable cups helps create a sustainable future. Every small action counts!",
                "Together we can reduce waste by choosing reusable options.",
                "Your commitment to using reusable cups makes a real difference!"
            ],
            'impact': [
                "You've helped save {} trees and reduced CO2 emissions significantly!",
                "Your {} recycled cups have prevented {} kg of waste!",
                "By recycling {} cups, you've saved {} liters of water!"
            ],
            'daily': [
                "Reducing your daily {} cups could save {} cups annually!",
                "Using {} fewer disposable cups daily adds up to {} yearly!",
                "Your daily reduction of {} cups prevents {} kg of waste yearly!"
            ]
        }

    def generate_ai_message(self, prompt: str, min_positivity: float = 0.2) -> Dict:
        """Generate message using local models and templates with better error handling"""
        try:
            if not self.generator:
                return self._generate_template_response(prompt)

            # Generate text using the local model
            try:
                generated = self.generator(prompt, 
                                        max_length=100, 
                                        num_return_sequences=1,
                                        pad_token_id=50256)[0]['generated_text']
                
                message = generated.replace(prompt, '').strip()
                message = message.split('.')[0] + '.'  # Keep first sentence
                
                sentiment = self.analyze_sentiment(message)
                
                if sentiment['scores']['compound'] < min_positivity:
                    return self._generate_template_response(prompt)
                    
                return {
                    'message': message,
                    'sentiment': sentiment
                }
                
            except Exception as model_error:
                st.warning(f"Model generation failed, using template: {str(model_error)}")
                return self._generate_template_response(prompt)
            
        except Exception as e:
            st.error(f"Generation Error: {str(e)}")
            return self._generate_template_response(prompt)

    def _generate_template_response(self, prompt: str) -> Dict:
        """Generate a response using templates with sentiment analysis"""
        message = self._get_template_message(prompt)
        return {
            'message': message,
            'sentiment': self.analyze_sentiment(message) if self.sia else {
                'scores': {'pos': 0.8, 'neu': 0.2, 'neg': 0.0, 'compound': 0.8}
            }
        }

    def _get_template_message(self, prompt: str) -> str:
        """Get a message from templates based on prompt type and context"""
        import random
        import re

        # Extract numbers safely using regex
        numbers = [int(num) for num in re.findall(r'\d+', prompt)]
        cups = numbers[0] if numbers else 0

        # Parse prompt content more safely
        prompt_lower = prompt.lower()
        
        # Choose appropriate template
        if any(word in prompt_lower for word in ['sustainability', 'eco-friendly']):
            return random.choice(self.eco_templates['generic'])
        
        elif any(word in prompt_lower for word in ['recycling', 'recycled']):
            if cups > 0:
                trees = round(cups * 0.0005, 2)
                water = round(cups * 0.5, 2)
                template = random.choice(self.eco_templates['impact'])
                return template.format(
                    trees if 'trees' in prompt_lower else cups,
                    cups,
                    water
                )
            return random.choice(self.eco_templates['generic'])
        
        else:  # daily usage
            daily = cups if cups > 0 else 1
            yearly = daily * 365
            waste = round(yearly * 0.01, 2)
            template = random.choice(self.eco_templates['daily'])
            return template.format(daily, yearly)

    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment and return detailed scores"""
        scores = self.sia.polarity_scores(text)
        return {
            'sentiment': 'positive' if scores['compound'] > 0 else 'negative' if scores['compound'] < 0 else 'neutral',
            'scores': scores,
            'original_text': text
        }

    def generate_feedback(self, recycled_cups: int, daily_usage: int) -> Tuple[str, str, str]:
        total_co2 = recycled_cups * 0.012
        total_water = recycled_cups * 0.04
        daily_co2 = daily_usage * 0.012
        daily_water = daily_usage * 0.04

        # Generate a motivational message for generic
        generic_msg = f"Great job on recycling {recycled_cups} cups! Keep up the good work to make a positive impact on the environment."

        # Provide a real actionable tip for usage
        if recycled_cups > 1000:
            usage_msg = "You've recycled a significant number of cups! Consider sharing your experience with others to inspire them."
        else:
            usage_msg = "Keep recycling and encourage your friends and family to join you in making a difference."

        # Provide a real actionable tip for daily usage
        if daily_usage > 5:
            daily_msg = "Try reducing your daily cup usage by bringing your own reusable cup to work or school."
        else:
            daily_msg = "You're doing great! Keep using your reusable cup to further reduce waste."

        return generic_msg, usage_msg, daily_msg

    def generate_feedback_streamlit(self):
        st.title("AI-Powered Eco Brew Feedback Generator")
        
        recycled_cups = st.number_input("Enter the number of recycled cups:", min_value=0, value=0)
        daily_usage = st.number_input("Enter your daily cup usage:", min_value=0, value=0)

        if st.button("Generate AI Feedback"):
            with st.spinner("Generating personalized feedback..."):
                g_msg, u_msg, d_msg = self.generate_feedback(recycled_cups, daily_usage)
                st.write(g_msg)
                st.write(u_msg)
                st.write(d_msg)

    def generate_feedback_streamlit_with_db(self, user_id: str):
        st.title("Eco Brew Feedback Generator")

        try:
            response = requests.get(f"http://localhost:3000/api/user/{user_id}")
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            st.error(f"Failed to fetch user data: {e}")
            return

        user_data = response.json()
        recycled_cups = user_data.get("recycledCups", 0)
        daily_usage = user_data.get("dailyCupUsage", 0)

        if st.button("Generate Feedback"):
            generic, usage, daily = self.generate_feedback(recycled_cups, daily_usage)
            st.subheader("Generic Feedback")
            st.write(generic)
            st.subheader("Usage-Based Feedback")
            st.write(usage)
            st.subheader("Daily Usage-Based Feedback")
            st.write(daily)

        if st.button("Show Stats"):
            stats = self.get_stats(recycled_cups, daily_usage)
            st.subheader("Statistics")
            st.json(stats)
