import random
from typing import Dict, Tuple
import streamlit as st
import requests

class FeedbackGenerator:
    def __init__(self):
        self.generic_messages = [
            "🌍 Every reusable cup is a step towards a cleaner Earth! Switch to a reusable cup and inspire others.",
            "🌱 Did you know? One reusable cup can save 365 paper cups per year! Be the change.",
            "🌿 Paper cups take 20 years to decompose. Your switch to reusable cups can make a huge difference!",
            "🌏 Small actions lead to big changes. Start using a reusable cup today!",
            "🌎 Help reduce waste by using a reusable cup. Every effort counts!",
            "🌍 Be a hero for the planet. Switch to reusable cups and reduce waste!",
            "🌱 Your choice to use a reusable cup can inspire others to do the same.",
            "🌿 Make a positive impact on the environment by using a reusable cup.",
            "🌏 Every reusable cup used is one less paper cup in the landfill.",
            "🌎 Join the movement to reduce waste by using a reusable cup."
        ]
        
        self.usage_based_messages = [
            "You've recycled {cups} cups! That's like saving {trees:.1f} trees! Keep going! 🌳",
            "Wonderful! {cups} recycled cups means {water:.1f} gallons of water saved! 💧",
            "Amazing! By recycling {cups} cups, you've reduced carbon emissions equivalent to {miles:.1f} miles of driving! 🚗",
            "Great job! {cups} recycled cups have saved {trees:.1f} trees from being cut down! 🌲",
            "Fantastic! {cups} recycled cups have conserved {water:.1f} gallons of water! 💦",
            "Impressive! {cups} recycled cups have reduced CO2 emissions by {miles:.1f} miles of driving! 🚙",
            "Keep it up! {cups} recycled cups have saved {trees:.1f} trees! 🌴",
            "Awesome! {cups} recycled cups have saved {water:.1f} gallons of water! 🚰",
            "Excellent! {cups} recycled cups have reduced carbon emissions by {miles:.1f} miles of driving! 🚕",
            "Bravo! {cups} recycled cups have saved {trees:.1f} trees! 🌳"
        ]
        
        self.daily_usage_messages = [
            "Using {daily} cups daily adds up to {yearly} cups yearly. Try reducing it by one cup this week! 🎯",
            "Your daily usage of {daily} cups contributes to {yearly} cups annually. Small changes make big impacts! ⭐",
            "With {daily} cups daily, you could save ₹{yearly_cost:.2f} yearly by switching to a reusable cup! 💰",
            "Reducing your daily usage of {daily} cups can save {yearly} cups annually. Give it a try! 🌟",
            "By cutting down to {daily} cups daily, you can save {yearly} cups each year. Every bit helps! 🌠",
            "Switching to a reusable cup for {daily} daily uses can save you ₹{yearly_cost:.2f} annually! 💵",
            "Try reducing your daily cup usage to {daily} cups. It adds up to {yearly} cups yearly! 🌠",
            "Cutting down to {daily} cups daily can save you ₹{yearly_cost:.2f} each year. Start today! 💲",
            "Using {daily} cups daily means {yearly} cups yearly. Reduce it and make a difference! 🌟",
            "Switch to a reusable cup for {daily} daily uses and save ₹{yearly_cost:.2f} annually! 💸"
        ]

    def calculate_environmental_impact(self, recycled_cups: int) -> Dict:
        return {
            'trees': recycled_cups * 0.0005,  # Each 2000 cups = 1 tree
            'water': recycled_cups * 0.05,    # Gallons of water saved per cup
            'miles': recycled_cups * 0.1      # CO2 equivalent in driving miles
        }

    def generate_feedback(self, recycled_cups: int, daily_usage: int) -> Tuple[str, str, str]:
        # Generic suggestion
        generic = random.choice(self.generic_messages)
        
        # Recycling-based suggestion
        impact = self.calculate_environmental_impact(recycled_cups)
        usage = random.choice(self.usage_based_messages).format(
            cups=recycled_cups,
            trees=impact['trees'],
            water=impact['water'],
            miles=impact['miles']
        )
        
        # Daily usage-based suggestion
        yearly_cups = daily_usage * 365
        yearly_cost = yearly_cups * 0.50  # Assuming ₹0.50 per paper cup
        daily = random.choice(self.daily_usage_messages).format(
            daily=daily_usage,
            yearly=yearly_cups,
            yearly_cost=yearly_cost
        )
        
        return (generic, usage, daily)

    def get_stats(self, recycled_cups: int, daily_usage: int) -> Dict:
        impact = self.calculate_environmental_impact(recycled_cups)
        return {
            "recycled_cups": recycled_cups,
            "daily_usage": daily_usage,
            "trees_saved": impact['trees'],
            "water_saved": impact['water'],
            "emissions_saved": impact['miles'],
            "yearly_cups": daily_usage * 365,
            "yearly_cost": (daily_usage * 365 * 0.50)
        }

    def generate_feedback_streamlit(self):
        st.title("Cup Karma Feedback Generator")

        recycled_cups = st.number_input("Enter the number of recycled cups:", min_value=0, value=0)
        daily_usage = st.number_input("Enter your daily cup usage:", min_value=0, value=0)

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

    def generate_feedback_streamlit_with_db(self, user_id: str):
        st.title("Cup Karma Feedback Generator")

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
