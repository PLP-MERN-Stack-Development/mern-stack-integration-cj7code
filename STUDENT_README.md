MERN Blog Application

A full-stack blog platform built using the MERN stack (MongoDB, Express, React, Node.js).
It allows users to create, read, update, and delete blog posts, register and log in with authentication, and provides an admin interface for managing content.

🚀 Project Overview

This MERN Blog application demonstrates integration between the frontend (React + Vite) and the backend (Express + MongoDB).
The system supports user authentication (JWT-based), role management (Admin/User), and basic CRUD operations for blog posts.

🎯 Core Objectives

Implement RESTful API with Node.js and Express

Connect to a MongoDB Atlas database

Build a React frontend with Vite

Manage authentication using JWT

Demonstrate full MERN stack integration

⚙️ Tech Stack
| Layer          | Technology Used                                    |
| -------------- | -------------------------------------------------- |
| Frontend       | React (Vite), Axios, React Router DOM, TailwindCSS |
| Backend        | Node.js, Express.js, Mongoose                      |
| Database       | MongoDB Atlas                                      |
| Authentication | JWT (JSON Web Token)                               |
| Tools          | GitHub Classroom, Postman, VS Code                 |

📂 Folder Structure
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── STUDENT_README.md       # Project documentation

⚡️ Setup Instructions
🔧 Prerequisites

Ensure you have installed:

Node.js (v18+)

npm or yarn

MongoDB Atlas account

Git

🖥 Backend Setup

Navigate to the server folder

cd server


Install dependencies

npm install


Set up environment variables

Create a .env file in /server based on .env.example:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern_blog
JWT_SECRET=your_jwt_secret


Start the backend server

npm run dev


Server runs on: http://localhost:5000

🌐 Frontend Setup

Navigate to the client folder

cd client


Install dependencies

npm install


Set up environment variables

Create a .env file in /client based on .env.example:

VITE_API_URL=http://localhost:5000/api


Run the frontend

npm run dev


App runs on: http://localhost:5173

📡 API Documentation
Base URL
http://localhost:5000/api

Endpoints
| Method | Endpoint         | Description              | Auth |
| ------ | ---------------- | ------------------------ | ---- |
| POST   | `/auth/register` | Register a new user      | ❌    |
| POST   | `/auth/login`    | Log in and receive a JWT | ❌    |
| GET    | `/posts`         | Get all blog posts       | ❌    |
| GET    | `/posts/:id`     | Get single post          | ❌    |
| POST   | `/posts`         | Create a new post        | ✅    |
| PUT    | `/posts/:id`     | Update a post            | ✅    |
| DELETE | `/posts/:id`     | Delete a post            | ✅    |


✅ = Requires token (Authorization: Bearer <JWT>)

🧩 Features Implemented

User registration and login

JWT-based authentication and authorization

Role-based access (Admin/User)

CRUD operations for blog posts

Responsive frontend (React + Tailwind)

MongoDB Atlas cloud integration

Proxy configuration for API requests via Vite

🖼 Screenshots
🏠 Home Page

✍️ Create Post

🔐 Login Page

🧪 Testing

All endpoints were tested using Postman

Database verified using MongoDB Atlas

Frontend and backend integrated and tested successfully


🧭 Submission Checklist

✅ Both client and server code included
✅ .env.example files provided
✅ Comprehensive README with overview, setup, and screenshots
✅ API routes tested and documented
✅ Commits pushed to GitHub

👨‍💻 Author

Name: Joseph Sakala C.J.
Project: MERN Stack Integration Assignment
Supervisor: [Dedan Okware]