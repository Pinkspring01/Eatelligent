# Eatelligent

# Project Descrption:
According to studies by the NRDC and Harvard Law, approximately 91% of individuals discard perfectly good food due to confusing labels like “sell by” and “best by.” This contributes significantly to food waste, which eventually rots in landfills and emits potent greenhouse gases. Eatelligent is an online platform designed to combat the climate crisis by helping users manage food waste. Users can track their groceries and receive notifications for items nearing expiration. What sets Eatelligent apart is its ability to generate custom recipes that specifically prioritize those soon-to-expire ingredients.

# Tracks
 - Sustainability
 - Best SlugHacks
 - Use of GenAI
 - Most Start-up Potential
 - Best Use of MongoDB

# Tech Stack:
Frontend: JavaScript, CSS (React/Vite)

Database: MongoDB Atlas to store user preferences, ingredients, and recipe data.

Authentication: Firebase Authentication for secure sign-up, login, and session management.

LLM: HuggingFace (Llama-3.1-8B-Instruct) to generate dynamic, user-specific recipes based on inventory.

# Challenges & Learnings:

We originally envisioned Eatelligent as a mobile application. However, due to the complexities of converting a MERN stack web app into a mobile environment within the hackathon time constraints, we pivoted to a high-quality web application.

# What We Learned:

As first-time users of the MERN stack, we gained deep experience in connecting a full-stack architecture with external services. We successfully integrated Firebase for security and LLMs for intelligent response    generation, learning how to manage data flow between the database and the AI.

# What’s Next for Eatelligent:

1. Mobile Conversion: Porting the web experience to a native mobile app.

2. Computer Vision: Implementing an image-recognition system so users can photograph groceries to auto-extract data instead of manual entry.

3. Deployment: Launching a live version via Vercel.

# Steps to Run the Application:

1. Start the Server Navigate to the server directory in your terminal:
   cd server
   npm install
   node --env-file=.env server
3. Start the Client Open a new terminal window and navigate to the client directory:
   cd client
   npm run dev
4. Access the App Click the local link provided in your terminal (e.g., http://localhost:5173) to view the live project.
