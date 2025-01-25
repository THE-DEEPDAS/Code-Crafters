# Eco Brew

## Demo Video
You can find it at https://drive.google.com/drive/folders/1wvuD4UyRtReF6DQI2bZ9pPxdHdil6nSv?usp=sharing

## Submission Doc
It is attached in the main repo itself, name of the file is "Team Code Crafters Submission (2).pdf"

## Table of Contents
- [Introduction](#introduction)
- [Impact](#impact)
- [Motive](#motive)
- [Technical Approach](#technical-approach)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [AI Integration](#ai-integration)
  - [Real-Time Features](#real-time-features)
  - [Database](#database)
  - [Deployment](#deployment)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Steps](#steps)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Future Work](#future-work)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Eco Brew is an innovative platform dedicated to promoting sustainable practices by encouraging the recycling of cups. By leveraging modern technologies such as AI, real-time data processing, and robust frontend and backend frameworks, Eco Brew aims to create a user-friendly environment where individuals can track, analyze, and enhance their recycling habits. Our mission is to reduce environmental waste and foster a community committed to eco-friendly living.

## Impact

Eco Brew is set to revolutionize the way individuals engage with environmental conservation by addressing one of the most pervasive waste issues of our time—disposable cups. Our platform doesn't just aim to reduce waste; it aspires to ignite a global movement towards sustainability. The multifaceted impact of Eco Brew includes:

- **Massive Waste Reduction:** By incentivizing the use of reusable cups, Eco Brew has the potential to eliminate millions of disposable cups from landfills annually, drastically cutting down on urban waste and reducing the burden on waste management systems.
- **Significant Resource Conservation:** Each reusable cup saved translates to the preservation of countless trees, gallons of water, and substantial reductions in carbon emissions associated with the production and transportation of single-use cups.
- **Exponential Carbon Footprint Reduction:** Through collective user action, Eco Brew can achieve a monumental decrease in carbon emissions, contributing to global efforts against climate change and fostering a healthier planet for future generations.
- **Unparalleled Educational Outreach:** By providing users with insightful data and engaging content, Eco Brew educates and empowers individuals to make informed, eco-friendly choices, fostering a culture of sustainability.
- **Robust Community Building:** Our platform not only tracks individual efforts but also cultivates a vibrant community of environmentally conscious individuals who motivate each other, share success stories, and collaboratively drive meaningful change.

Through these initiatives, Eco Brew doesn't just envision a cleaner planet—it actively constructs the pathways to achieve it, making sustainability accessible and achievable for everyone.

## Motive

The driving force behind Eco Brew is the urgent need to combat the escalating environmental crisis caused by disposable cup waste. Single-use cups are not only a glaring symbol of consumerism but also a significant contributor to environmental degradation. They take years to decompose, leaching harmful chemicals into the soil and waterways, and their production consumes vast amounts of natural resources. Recognizing these critical challenges, Eco Brew is passionately committed to:

- **Empowering Individuals:** Providing users with the tools and incentives to take control of their environmental impact, transforming everyday actions into powerful statements of sustainability.
- **Innovating Sustainability Solutions:** Leveraging cutting-edge technology to create an intuitive and engaging platform that seamlessly integrates eco-friendly practices into users' daily lives.
- **Fostering Global Responsibility:** Encouraging a sense of collective responsibility where every recycled cup contributes to a larger, global effort to preserve our planet.
- **Driving Behavioral Change:** Utilizing AI-driven feedback and real-time data to inspire continuous improvement and sustained commitment to eco-friendly habits.
- **Promoting Economic Efficiency:** Demonstrating that sustainable choices are not only good for the planet but also economically beneficial, reducing long-term costs associated with waste management and resource depletion.

Eco Brew is not just addressing a problem; it is spearheading a transformative movement towards a sustainable future, where every cup counts and every action makes a difference.

## Technical Approach

Eco Brew deploys a robust and sophisticated technical infrastructure to ensure a seamless, secure, and highly efficient user experience. Our comprehensive technical strategy encompasses the following components:

### Frontend

- **Framework:** Developed with **React.js**, Eco Brew's frontend offers a dynamic and responsive user interface that ensures smooth navigation and an engaging user experience.
- **UI Components:** Utilizing **Lucid React**, we incorporate elegant and customizable UI elements that enhance the visual appeal and usability of the platform.
- **Data Visualization:** **Chart.js** is employed to deliver interactive and insightful data visualizations, allowing users to easily comprehend their recycling metrics and environmental impact.
- **Real-Time Updates:** Integration with **Socket.io** facilitates real-time updates for leaderboards and notifications, keeping users informed and motivated.
- **State Management:** Leveraging React's built-in hooks and context API for efficient and scalable state management, ensuring optimal performance and maintainability.

### Backend

- **Server Framework:** Built on **Node.js** and **Express.js**, the backend is engineered to handle high volumes of API requests with exceptional efficiency and reliability.
- **Authentication:** Implementing secure user authentication through **JWT (JSON Web Tokens)** and **bcryptjs** for robust password hashing, ensuring user data integrity and security.
- **API Design:** Adhering to RESTful principles, our API endpoints are designed for scalability, maintainability, and ease of integration with other services.
- **Error Handling:** Incorporating comprehensive error handling mechanisms to provide clear, user-friendly error messages and maintain system reliability.

### AI Integration

- **Language and Framework:** Utilizing **Python** for developing sophisticated AI-driven feedback generators, coupled with **Streamlit** to create an interactive web interface.
- **Functionality:** The AI component analyzes user data to deliver personalized feedback and recommendations, enhancing user engagement and promoting sustainable habits.
- **Seamless Communication:** Ensuring seamless integration with the backend through secure API calls, allowing real-time data fetching and feedback generation.

### Real-Time Features

- **Leaderboard:** A highly interactive **Socket.io**-powered leaderboard fosters friendly competition among users, incentivizing increased recycling efforts.
- **Live Notifications:** Real-time notifications inform users of achievements, milestones, and community activities, keeping them engaged and motivated.
- **Interactive Elements:** Features such as commenting and sharing achievements enhance community interaction, allowing users to celebrate successes and encourage one another.

### Database

- **Database System:** Powered by **MongoDB**, Eco Brew's database offers exceptional flexibility and scalability, adept at handling diverse and dynamic data types.
- **Data Models:** Comprehensive and well-structured schemas for users, achievements, and statistics ensure efficient data storage, retrieval, and management.
- **Security and Integrity:** Implementing stringent security measures, including proper indexing, data validation, and access controls, to safeguard user information and maintain data integrity.

### Deployment

- **Frontend Deployment:** Utilizing **Vite** for optimized and rapid frontend builds, deployed seamlessly on platforms like **Vercel** or **Netlify** to ensure high availability and performance.
- **Backend Deployment:** Hosting the backend on **Heroku** or **Vercel**, providing a scalable and reliable server environment that can handle increasing user demand.
- **AI Deployment:** We have used streamlit to deploy the AI feature.
- **Continuous Integration/Continuous Deployment (CI/CD):** Establishing robust CI/CD pipelines automates testing, building, and deployment processes, facilitating rapid and error-free updates.
- **Environment Management:** Securely managing environment variables to protect sensitive information, such as API keys and database credentials, through best practices and reliable environment management tools.

By integrating these advanced technical components, Eco Brew ensures a state-of-the-art platform that not only meets but exceeds user expectations, driving impactful environmental change through innovative technology.

## Features

Eco Brew offers a range of features designed to enhance user experience and promote sustainable practices:

- **User Authentication:** Secure sign-up and sign-in mechanisms to protect user data.
- **Dashboard:** Comprehensive dashboard displaying recycled cups, environmental impact metrics, and personal achievements.
- **Real-Time Leaderboard:** Competitive leaderboard to motivate users by comparing their recycling efforts with others.
- **AI-Driven Feedback:** Personalized feedback providing encouragement and insights based on user data.
- **Achievements & Certificates:** Unlock milestones and receive certificates celebrating environmental contributions.
- **Metrics Tracking:** Monitor statistics such as trees saved, water conserved, and carbon emissions reduced.
- **Community Engagement:** Engage with a community of like-minded individuals through forums and shared achievements.
- **Mission & Team Information:** Learn about the mission of Eco Brew and meet the dedicated team behind the project.
- **Contact & Support:** Access contact information and support for assistance and inquiries.

## Installation

### Prerequisites

Before installing Eco Brew, ensure you have the following installed on your system:

- **Node.js** (v14 or later) and **npm**
- **Python** (v3.8 or later)
- **MongoDB** instance
- **Git**

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/cup-karma.git
   cd cup-karma
   ```

2. **Setup Backend:**

   ```bash
   cd Backend
   npm install
   ```

   - Create a `.env` file in the `Backend` directory and add the following:

     ```
     JWT_SECRET=your_jwt_secret_key
     MONGO_URI=your_mongodb_connection_string
     ```

   - Start the backend server:

     ```bash
     npm start
     ```

3. **Setup Frontend:**

   ```bash
   cd ../Frontend
   npm install
   ```

   - Create a `.env` file in the `Frontend` directory and add the following:

     ```
     REACT_APP_API_URL=http://localhost:3000
     ```

   - Start the frontend development server:

     ```bash
     npm start
     ```

4. **Setup AI Component:**

   ```bash
   cd ../AI
   pip install -r requirements.txt
   ```

   - Start the AI feedback generator:

     ```bash
     streamlit run feedback.py
     ```

## Usage

1. **Sign Up:** Create an account by providing a username, email, and password.
2. **Sign In:** Access your account using your credentials.
3. **Dashboard:** View your recycled cups, environmental impact statistics, and personal achievements.
4. **Leaderboard:** Check your ranking among other users and strive to climb the leaderboard.
5. **Update Metrics:** Input your recycled cups and daily cup usage to track your progress.
6. **AI Feedback:** Receive personalized feedback and suggestions based on your recycling habits.
7. **Achievements:** Unlock milestones and view your achievements and certificates.
8. **Community Engagement:** Interact with other users, share achievements, and participate in community discussions.
9. **Contact Support:** Reach out through the contact page for any assistance or inquiries.

## Technologies Used

- **Frontend:**
  - **React.js:** For building a dynamic and responsive user interface.
  - **Vite:** For optimized frontend builds and rapid development.
  - **Lucid React:** For elegant and customizable UI components.
  - **Chart.js:** For creating interactive data visualizations.

- **Backend:**
  - **Node.js & Express.js:** For handling server-side logic and API endpoints.
  - **Socket.io:** For implementing real-time features like leaderboards and notifications.
  - **JWT (JSON Web Tokens):** For secure user authentication.
  - **bcryptjs:** For password hashing and security.

- **AI:**
  - **Python:** For developing the AI-driven feedback generator.
  - **Streamlit:** For creating an interactive web interface for AI functionalities.

- **Database:**
  - **MongoDB:** For flexible and scalable data storage.

- **Deployment:**
  - **Vercel/Netlify:** For deploying the frontend application.
  - **Heroku/Vercel:** For deploying the backend server.
  - **Streamlit Sharing:** For hosting the AI feedback generator.

- **Icons:**
  - **Lucide React:** For incorporating modern and scalable icons into the application.

## Contributing

Contributions are welcome! We encourage you to fork the repository and submit pull requests for any improvements, bug fixes, or new features. Please follow these steps to contribute:

1. **Fork the Repository:** Click the fork button at the top right of this page to create your own copy.
2. **Clone the Forked Repository:**

   ```bash
   git clone https://github.com/yourusername/cup-karma.git
   cd cup-karma
   ```

3. **Create a New Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes:** Implement your feature, bug fix, or improvement.
5. **Commit Your Changes:**

   ```bash
   git commit -m "Add feature: your-feature-name"
   ```

6. **Push to Your Fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request:** Navigate to the original repository and submit a pull request from your forked repository.

Please ensure your contributions adhere to the project's coding standards and include appropriate documentation and tests where necessary.

