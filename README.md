# 🎓 Student–Course Management System (MERN Microservices Architecture)

**Course:** 22MDC55 – Full Stack Application Development Laboratory  
**Exercise 13:** Develop and Deploy a Microservices-Based MERN Application  

---

## 📌 Architecture Overview

This project is a complete **Student–Course Management System** built using a true **Microservices Architecture** with the MERN stack.

```text
                                  +-----------------------+
                                  |     React Frontend    |
                                  | http://localhost:5173 |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     | GET/POST /api/students                          | GET/POST /api/courses
                     v                                                 v
        +--------------------------+                      +-------------------------+
        |   Student Microservice   | -- HTTP REST Call -> |   Course Microservice   |
        |  http://localhost:5001   | GET /api/courses/:id |  http://localhost:5002  |
        +------------+-------------+                      +------------+------------+
                     |                                                 |
                     v                                                 v
           [ Student Database ]                              [ Course Database ]
          (MongoDB: student_db)                             (MongoDB: course_db)
```

### Key Principles Applied:
1. **Independent Microservices:** `student-service` and `course-service` are completely separated with their own Express servers, ports, models, controllers, database connections, and `.env` configurations.
2. **Inter-Service REST Communication:** `Student Service` does **not** access `Course Service`'s database directly. Instead, when requesting combined details (`GET /api/students/:studentId/details`), `Student Service` makes an HTTP REST request via `Axios` to `Course Service` (`GET http://localhost:5002/api/courses/:courseId`) and merges the responses for the frontend.
3. **Frontend Integration:** Built with React + Vite, styled using modern glassmorphism UI principles, and connects to both services asynchronously.

---

## 📁 Project Structure

```text
student-course-microservices/
│
├── student-service/               # Node.js + Express (Port 5001)
│   ├── controllers/
│   │   └── studentController.js   # Student endpoints & HTTP inter-service logic
│   ├── models/
│   │   └── Student.js             # Mongoose Student Schema
│   ├── routes/
│   │   └── studentRoutes.js       # Student Express Router
│   ├── .env                       # Student Service Environment Config
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express Entry point & MongoDB connection
│
├── course-service/                # Node.js + Express (Port 5002)
│   ├── controllers/
│   │   └── courseController.js    # Course endpoints logic
│   ├── models/
│   │   └── Course.js              # Mongoose Course Schema
│   ├── routes/
│   │   └── courseRoutes.js        # Course Express Router
│   ├── .env                       # Course Service Environment Config
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express Entry point & MongoDB connection
│
├── frontend/                      # React + Vite Application (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentList.jsx
│   │   │   ├── CourseForm.jsx
│   │   │   ├── CourseList.jsx
│   │   │   └── StudentCourseDetails.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios API service handlers
│   │   ├── App.jsx
│   │   ├── index.css              # Custom Glassmorphism Styling System
│   │   └── main.jsx
│   ├── .env                       # Frontend Environment Config
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── LAB_RECORD.md                  # Complete Academic Laboratory Record Writeup
└── README.md                      # Project Documentation
```

---

## 🍃 MongoDB Atlas Setup Guide

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Free Tier Cluster (M0)**.
3. Create a **Database User**:
   - Go to **Database Access** -> **Add New Database User**.
   - Set Username (e.g., `labuser`) and Password (e.g., `LabPassword123`).
4. Set Network Access:
   - Go to **Network Access** -> **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
5. Get Connection Strings:
   - Click **Connect** on your Cluster -> **Drivers** (Node.js).
   - Copy connection URI format:
     `mongodb+srv://labuser:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority`
6. Update Environment Variables:
   - In `course-service/.env`:
     `MONGO_URI=mongodb+srv://labuser:LabPassword123@cluster0.mongodb.net/course_db?retryWrites=true&w=majority`
   - In `student-service/.env`:
     `MONGO_URI=mongodb+srv://labuser:LabPassword123@cluster0.mongodb.net/student_db?retryWrites=true&w=majority`

*(Note: Local MongoDB running on `mongodb://127.0.0.1:27017` is also fully supported out-of-the-box).*

---

## ⚡ Step-by-Step Local Run Instructions

To run the application, open **3 separate terminal windows** (or terminal split panes):

### Terminal 1: Start Course Microservice (Port 5002)
```bash
cd course-service
npm run dev
```
*Console Output:* `🚀 Course Microservice is running on http://localhost:5002`

### Terminal 2: Start Student Microservice (Port 5001)
```bash
cd student-service
npm run dev
```
*Console Output:* `🚀 Student Microservice is running on http://localhost:5001`

### Terminal 3: Start React Frontend (Port 5173)
```bash
cd frontend
npm run dev
```
*Console Output:* `Local: http://localhost:5173/`

Open `http://localhost:5173/` in your browser.

---

## 📬 Postman API Testing Guide

### 1. Course Microservice (`http://localhost:5002`)

#### A. Create a New Course
- **Method:** `POST`
- **URL:** `http://localhost:5002/api/courses`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "courseId": "C001",
  "courseName": "Full Stack Application Development",
  "credits": 4
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "6601a1b2c3d4e5f678901234",
    "courseId": "C001",
    "courseName": "Full Stack Application Development",
    "credits": 4,
    "createdAt": "2026-09-29T23:00:00.000Z"
  }
}
```

#### B. Get All Courses
- **Method:** `GET`
- **URL:** `http://localhost:5002/api/courses`

#### C. Get Particular Course by ID
- **Method:** `GET`
- **URL:** `http://localhost:5002/api/courses/C001`

---

### 2. Student Microservice (`http://localhost:5001`)

#### A. Create a New Student
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/students`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "studentId": "S001",
  "name": "Nandana",
  "email": "nandana@gmail.com",
  "courseId": "C001"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "6601b2c3d4e5f67890123456",
    "studentId": "S001",
    "name": "Nandana",
    "email": "nandana@gmail.com",
    "courseId": "C001"
  }
}
```

#### B. Get All Students
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/students`

#### C. Get Student by ID
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/students/S001`

#### D. Get Inter-Service Student & Course Combined Details (Crucial Endpoint)
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/students/S001/details`
- **Response (200 OK):**
```json
{
  "student": {
    "studentId": "S001",
    "name": "Nandana",
    "email": "nandana@gmail.com"
  },
  "course": {
    "courseId": "C001",
    "courseName": "Full Stack Application Development",
    "credits": 4
  }
}
```

---

## 🌐 Deployment Instructions (Render & Vercel / Static Host)

### Step 1: Deploy Course Microservice to Render
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com).
3. Click **New +** -> **Web Service**.
4. Select your GitHub repository.
5. Set Root Directory: `course-service`
6. Build Command: `npm install`
7. Start Command: `node server.js`
8. Under **Environment Variables**, add:
   - `PORT` = `10000` (or leave default Render port)
   - `MONGO_URI` = `mongodb+srv://...` (your Atlas MongoDB URI)
9. Click **Create Web Service**. Note your deployed Course Service URL (e.g. `https://course-service-xyz.onrender.com`).

### Step 2: Deploy Student Microservice to Render
1. Click **New +** -> **Web Service**.
2. Select your GitHub repository.
3. Set Root Directory: `student-service`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Under **Environment Variables**, add:
   - `PORT` = `10000`
   - `MONGO_URI` = `mongodb+srv://...` (your Atlas MongoDB URI)
   - `COURSE_SERVICE_URL` = `https://course-service-xyz.onrender.com` (Deployed Course Service URL!)
7. Click **Create Web Service**. Note your deployed Student Service URL (e.g. `https://student-service-xyz.onrender.com`).

### Step 3: Deploy React Frontend to Render / Vercel / Netlify
1. On Render, click **New +** -> **Static Site** (or use Vercel / Netlify).
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Under **Environment Variables**, add:
   - `VITE_STUDENT_SERVICE_URL` = `https://student-service-xyz.onrender.com`
   - `VITE_COURSE_SERVICE_URL` = `https://course-service-xyz.onrender.com`
6. Deploy the site.

---

## ✅ Evaluation Criteria Mapping

| Evaluation Criteria | Marks | Implementation Details |
| :--- | :---: | :--- |
| **Microservices Architecture** | 6 | Completely independent `student-service` (Port 5001) and `course-service` (Port 5002) with distinct DB configurations. |
| **REST API Implementation** | 4 | Clean REST controllers for GET/POST student and course operations with validation & error handling. |
| **Inter-Service Communication** | 5 | `GET /api/students/:studentId/details` issues an HTTP GET call to Course Service using Axios and aggregates JSON payload. |
| **Deployment & Integration** | 5 | Environment variable driven URL parameters (`.env`), CORS configuration, and step-by-step production deployment instructions. |

---
