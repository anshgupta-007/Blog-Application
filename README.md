# 📝 Blog Application

A full-featured Blog Application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This project enables users to create, read, update, and delete blog posts via a clean and responsive web interface. It demonstrates a complete full-stack workflow including RESTful APIs, routing, and modular code structure.

---

## 🚀 Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Axios
- HTML5 / CSS3

**Backend:**
- Node.js
- Express.js
- Mongoose

**Database:**
- MongoDB (MongoDB Atlas or local)

**Dev Tools:**
- dotenv
- nodemon
- Git & GitHub
- VS Code

---

## ✨ Features

- Create, Read, Update, and Delete blog posts (CRUD)
- (Optional) Authentication with JWT & bcrypt
- REST API with error handling
- Fully responsive frontend
- Clean and modular codebase

---


---

## 🚀 Deployment Guide

Follow these steps to deploy the BLOGHUB application to production.

---

### 🌐 1. Set Up the Database

Use **MongoDB Atlas** for cloud-hosted MongoDB.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account.
2. Create a new cluster.
3. In the cluster dashboard, go to **Database Access** → Create a user.
4. In **Network Access**, add your IP or allow access from anywhere (`0.0.0.0/0`).
5. Get your **MongoDB URI** and keep it for backend deployment.

---

### 🔐 2. Environment Variables

Create a `.env` file for your backend with:

```env
Change your variables in env with your variables like
  MONGODB_URL = "Your MONGODB URL"
  PORT = 3000
  CLIENT_URL = "Your_FrontEnd_URL"
  MAIL_HOST = "smtp.gmail.com"
  MAIL_USER = "YOUR_MAIL_USER"
  MAIL_PASS = "YOuR_MAIL_PASS"
  JWT_SECRET = "YOUR_JWT_SECRET"

Create a `.env` file for your backend with:
```

Create a `.env` file for your frontEnd with:
```env
Change your variables in env with your variables like
  VITE_API_URL = "Your_server_url"
```



