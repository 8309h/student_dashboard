# Student Dashboard

## 📌 Overview

This project is a full-stack Student Dashboard built using Node.js, PostgreSQL, and React. It supports CRUD operations for students and their subject-wise marks with pagination and a responsive UI.

---

## 🛠 Tech Stack

* Backend: Node.js, Express.js
* Database: PostgreSQL
* Frontend: React.js (Vite)
* UI: Bootstrap
* Alerts: SweetAlert2

---

## ⚙️ Features

* Create student with multiple subject marks
* Update student and marks
* Delete student
* View student with marks
* Pagination support
* Search functionality
* Loading indicators
* Form validation

---

## 🗄 Database Schema

* Students table
* Marks table (linked using foreign key)

---

## 🚀 Setup Instructions

### 1. Clone Repository

git clone https://github.com/8309h/student_dashboard.git

### 2. Backend Setup

cd backend
npm install

Create `.env` file:
PORT=5000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=students_db
DB_PORT=5432

Run server:
npm start

---

### 3. Frontend Setup

cd frontend
npm install
npm run dev

---

## 🔗 API Endpoints

* POST /api/students
* GET /api/students?page=1&limit=5
* GET /api/students/:id
* PUT /api/students/:id
* DELETE /api/students/:id

---

