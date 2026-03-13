# Dynamic Form Builder

This project is a full-stack web application designed for building and managing dynamic forms. 

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), CORS

## Prerequisites
- Node.js installed on your machine.
- MongoDB instance running (either locally or a cloud instance like MongoDB Atlas).

## Project Structure
The project is divided into two main directories:
- `frontend/`: Contains the React application powered by Vite.
- `backend/`: Contains the Node.js Express server and MongoDB models.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Open the `.env` file in the `backend` directory and ensure your database connection string and API port are correctly configured (e.g., `MONGO_URI` and `PORT`).
4. Start the backend server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Running the Application
After starting both servers, the backend will be listening on its assigned port, and the frontend will run locally.

Open your browser and navigate to the Vite local URL to view and interact with the Dynamic Form Builder!

## 🤝 Contributing
```
git clone repo
npm install (both dirs)
npm run dev
```

## 📄 License
MIT - Use freely!

## 👨‍💻 Author
Shukla Jiya 
Registration no. - 2023/16421

⭐ Star if helpful!
