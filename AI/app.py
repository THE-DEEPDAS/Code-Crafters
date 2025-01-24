from feedback import FeedbackGenerator
import streamlit as st
import requests
import jwt
import streamlit.components.v1 as components

def main():
    st.markdown(
        """
        <style>
        body {
            background-color: #8D6E63;
            color: #fff;
        }
        .blackboard {
            background: #333;
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 20px;
            animation: fadeIn 2s;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .magic-box {
            background: #4CAF50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 20px;
            animation: popIn 1s;
        }
        @keyframes popIn {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
        }
        .card-container {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        }
        .card {
            width: 200px;
            height: 300px;
            perspective: 1000px;
            animation: morphIn 1s;
        }
        @keyframes morphIn {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
        }
        .card .front, .card .back {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .card .front {
            background: #4CAF50;
            color: white;
        }
        .card .back {
            background: #fff;
            color: black;
            transform: rotateY(180deg);
        }
        .card:hover .front {
            transform: rotateY(180deg);
        }
        .card:hover .back {
            transform: rotateY(0deg);
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    st.title("Cup Karma Feedback Generator")

    if 'token' not in st.session_state:
        username = st.text_input("Enter your Username:")
        password = st.text_input("Enter your Password:", type="password")
        
        if st.button("Sign In"):
            response = requests.post('http://localhost:3000/api/signin', json={'username': username, 'password': password})
            if response.status_code == 200:
                data = response.json()
                st.session_state.token = data['token']
                st.session_state.username = username
                st.success("Signed in successfully!")
            else:
                st.error("Failed to sign in: Invalid credentials")
    else:
        username = st.session_state.username
        token = st.session_state.token
        try:
            decoded_token = jwt.decode(token, options={"verify_signature": False})
            user_id = decoded_token.get('id')
            st.write(f"User ID: {user_id}")

            headers = {'Authorization': f'Bearer {token}'}
            response = requests.get(f'http://localhost:3000/api/user/{user_id}', headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                recycled_cups = user_data.get("recycledCups", 0)
                daily_usage = user_data.get("dailyCupUsage", 0)
                
                # Display the data in a magic box
                magic_box_html = f"""
                <div class="magic-box">
                    <h2>Recycled Cups: {recycled_cups}</h2>
                    <h2>Daily Cup Usage: {daily_usage}</h2>
                </div>
                """
                st.markdown(magic_box_html, unsafe_allow_html=True)
                
                generator = FeedbackGenerator()
                generic, usage, daily = generator.generate_feedback(recycled_cups, daily_usage)
                
                # Display recommendations with card flip animation
                cards_html = f"""
                <div class="card-container">
                    <div class="card">
                        <div class="front">
                            <h3>Generic Feedback</h3>
                        </div>
                        <div class="back">
                            <p>{generic}</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="front">
                            <h3>Usage-Based Feedback</h3>
                        </div>
                        <div class="back">
                            <p>{usage}</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="front">
                            <h3>Daily Usage-Based Feedback</h3>
                        </div>
                        <div class="back">
                            <p>{daily}</p>
                        </div>
                    </div>
                </div>
                """
                st.markdown(cards_html, unsafe_allow_html=True)
            else:
                st.write(f"Failed to fetch user data: {response.status_code} {response.reason}")
        except jwt.DecodeError:
            st.error("Invalid token")

if __name__ == "__main__":
    main()