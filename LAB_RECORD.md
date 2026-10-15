# 🧪 LABORATORY RECORD

**COURSE:** 22MDC55 – Full Stack Application Development Laboratory  
**EXERCISE NO:** 13  
**TITLE:** Development and Deployment of a Microservices-Based MERN Application (Student–Course Management System)  

---

## 🎯 1. AIM

To design, build, test, and deploy a microservices-based full-stack web application using the MERN stack (MongoDB, Express.js, React, Node.js) consisting of two independent microservices (`Student Microservice` and `Course Microservice`) that communicate via RESTful HTTP APIs and are integrated with a unified React frontend.

---

## 💻 2. SOFTWARE & HARDWARE REQUIREMENTS

### Software Requirements
- **Operating System:** Windows 10/11, Linux, or macOS
- **Runtime Environment:** Node.js (v18.0.0 or higher) & npm (v9.0.0 or higher)
- **Database:** MongoDB (Local instance or MongoDB Atlas Cloud Database)
- **Frontend Framework:** React (v18+) with Vite build tool
- **HTTP Client:** Axios for HTTP inter-service & frontend API calls
- **API Testing Tool:** Postman / Insomnia / cURL
- **Version Control & Cloud Hosting:** Git, GitHub, Render, Vercel / Netlify

### Hardware Requirements
- **Processor:** Intel Core i3 / AMD Ryzen 3 or higher
- **RAM:** Minimum 4 GB (8 GB recommended)
- **Storage:** Minimum 500 MB free disk space
- **Network:** Active Internet Connection for MongoDB Atlas & Cloud Deployment

---

## 🛠️ 3. PROCEDURE

1. **Environment Initialization:**
   - Create root folder `student-course-microservices/`.
   - Initialize three separate sub-projects: `student-service`, `course-service`, and `frontend`.
2. **Database Setup:**
   - Configure distinct MongoDB database connections (`student_db` and `course_db`) in `.env` files.
3. **Course Microservice Development (`course-service`):**
   - Create `Course.js` schema (`courseId`, `courseName`, `credits`).
   - Implement REST controllers for `POST /api/courses`, `GET /api/courses`, and `GET /api/courses/:courseId`.
   - Configure server to run independently on `http://localhost:5002`.
4. **Student Microservice Development (`student-service`):**
   - Create `Student.js` schema (`studentId`, `name`, `email`, `courseId`).
   - Implement REST controllers for `POST /api/students`, `GET /api/students`, and `GET /api/students/:studentId`.
   - Implement inter-service endpoint `GET /api/students/:studentId/details`:
     a. Query Student database for student record.
     b. Make HTTP GET request using Axios to Course Microservice (`GET /api/courses/:courseId`).
     c. Combine student and course objects and return to client.
   - Configure server to run independently on `http://localhost:5001`.
5. **Frontend Development (`frontend`):**
   - Initialize React application using Vite.
   - Build components: `Navbar`, `StudentForm`, `StudentList`, `CourseForm`, `CourseList`, and `StudentCourseDetails`.
   - Configure Axios service handlers to communicate with ports 5001 and 5002 via environment variables (`.env`).
6. **Testing & Verification:**
   - Run all three servers simultaneously in separate terminals.
   - Perform API testing using Postman.
   - Verify UI workflows for adding students/courses and inspecting inter-service merged details.
7. **Cloud Deployment:**
   - Push repository to GitHub.
   - Deploy backend services on Render with environment variables.
   - Deploy React frontend to static hosting platform.

---

## 🧩 4. IMPLEMENTATION & ARCHITECTURE DETAILS

### Architectural Principle
Unlike monolithic architectures where all models share a single database and process, this application uses **Database-per-Service Pattern**:

1. **Student Microservice (`student-service/`):**
   - Autonomous Express server running on port `5001`.
   - Manages student database (`student_db`).
   - Handles inter-service REST communication.

2. **Course Microservice (`course-service/`):**
   - Autonomous Express server running on port `5002`.
   - Manages course database (`course_db`).
   - Operates independently of student data.

3. **Inter-Service HTTP Communication Protocol:**
   - `Student Microservice` never directly connects to `Course Microservice`'s database.
   - Communication occurs purely via HTTP REST API (`Axios.get(`${COURSE_SERVICE_URL}/api/courses/${courseId}`)`).

---

## 📷 5. OUTPUT & SCREENSHOT GUIDE FOR LAB RECORD

When compiling your physical lab record, capture and attach the following screenshots:

1. **Terminal Screens:**
   - Terminal 1 showing `Course Microservice` listening on `http://localhost:5002`.
   - Terminal 2 showing `Student Microservice` listening on `http://localhost:5001`.
   - Terminal 3 showing `React Frontend` running on `http://localhost:5173`.
2. **Frontend UI Screens:**
   - **Student Management Tab:** Showing Student Form and table populated with student records.
   - **Course Management Tab:** Showing Course Form and table populated with course records.
   - **Inter-Service Details Tab:** Showing Student ID input/selector and the resulting combined Student + Course cards along with the JSON payload preview.
3. **Postman API Test Screens:**
   - `POST http://localhost:5002/api/courses` (201 Created)
   - `POST http://localhost:5001/api/students` (201 Created)
   - `GET http://localhost:5001/api/students/S001/details` showing aggregated JSON response.
4. **Cloud Deployment Screen:**
   - Active Render Dashboard showing deployed `student-service` and `course-service` instances.

---

## 🏆 6. RESULT

The Student–Course Management System microservices-based MERN application was successfully developed, tested, and deployed. Inter-service HTTP REST communication was implemented between the Student and Course microservices without violating database isolation. The application satisfies all microservice requirements, REST API specifications, and cloud deployment standards.

---

## ❓ 7. VIVA VOCE QUESTIONS & ANSWERS

### Q1: What is a Microservices Architecture, and how does it differ from a Monolithic Architecture?
**Answer:**  
In a **Monolithic Architecture**, all software modules (database models, business logic, UI handling) are packaged into a single codebase and deployed as a single unit. If one module fails or experiences high traffic, the entire application can crash or face performance bottlenecks.  
In a **Microservices Architecture**, the application is broken down into small, loosely coupled, independently deployable services (e.g., Student Service and Course Service). Each microservice handles a specific domain, runs its own process, manages its own database, and communicates with other services over lightweight HTTP REST APIs or messaging queues.

### Q2: Why do Student Service and Course Service have separate databases?
**Answer:**  
This follows the **Database-per-Service** design pattern. It ensures loose coupling, database independence, and domain isolation. If the Course Service database undergoes maintenance or schema changes, the Student Service can continue operating independently without direct database dependency or risk of corrupting external tables.

### Q3: Why should Course Service not directly expose its MongoDB to Student Service?
**Answer:**  
Directly sharing database access breaks encapsulation and microservice autonomy. If Student Service queries Course Service's MongoDB directly:
1. Both services become tightly coupled at the database layer.
2. Changes to Course DB schema will break Student Service queries.
3. Security, access rules, and data validation owned by Course Service are bypassed.  
Communicating via REST APIs enforces clear interface contracts and encapsulation.

### Q4: How does inter-service communication work in this project?
**Answer:**  
When a client calls `GET /api/students/:studentId/details`:
1. `Student Microservice` retrieves student data (`studentId`, `name`, `email`, `courseId`) from its local MongoDB (`student_db`).
2. `Student Microservice` extracts `courseId` and initiates an asynchronous HTTP `GET` request using `Axios` to `Course Microservice` (`http://localhost:5002/api/courses/:courseId`).
3. `Course Microservice` fetches course details from its database (`course_db`) and returns JSON to `Student Microservice`.
4. `Student Microservice` combines both objects into a unified JSON structure and sends it to the React frontend.

### Q5: What is CORS, and why is it required in this project?
**Answer:**  
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web pages from making API requests to a domain/port different from the one that served the web page.  
Since our React frontend runs on port `5173`, Student Service on port `5001`, and Course Service on port `5002`, the browser treats them as different origins. Using the `cors()` middleware in Express allows the backend services to explicitly permit requests from the frontend origin.

### Q6: What is the purpose of using `.env` files in microservices?
**Answer:**  
`.env` files store environment-specific configurations (such as port numbers, database URIs, API keys, and microservice URLs) outside the source code. This allows seamless transitions between environments (e.g., changing `http://localhost:5002` to `https://course-service.onrender.com` in production) without modifying code logic or exposing credentials in Git repositories.

### Q7: What are the primary HTTP methods used in REST APIs and their status codes?
**Answer:**  
- **`GET`:** Retrieves resources (Status: `200 OK`, `404 Not Found`).
- **`POST`:** Creates new resources (Status: `201 Created`, `400 Bad Request`).
- **`PUT` / `PATCH`:** Updates existing resources.
- **`DELETE`:** Removes resources (Status: `200 OK` / `204 No Content`).
- **`500 Internal Server Error` / `503 Service Unavailable`:** Server or inter-service communication failures.

---
