# 🚕 GesTaxi SaaS - Backend API (Node.js)

This is the complete RESTful API for the GesTaxi SaaS platform, a B2B corporate taxi management system. Built with Node.js and Express, it serves as the central brain for the entire ecosystem.

It handles business logic, database management (PostgreSQL), and secure authentication (JWT) for both the Admin Panel and the Employee Mobile App.

---

### ✨ Core Ecosystem

This project is the backend service for a complete full-stack application.
* **[Admin Panel (React)](https://github.com/Digao075/Taxi_Saas_Frontend)**
* **[Employee App (React Native)](https://github.com/Digao075/Taxi_Saas_Mobile-App)**

---

### 🛠️ Tech Stack

* **Node.js**
* **Express.js** (for routing and middleware)
* **PostgreSQL** (for the database)
* **node-postgres (pg)** (for database connection)
* **JWT (jsonwebtoken)** (for secure authentication)
* **bcrypt** (for password hashing)
* **CORS** (for cross-origin resource sharing)
* **dotenv** (for environment management)

---

### 🚀 Key Features

* **Dual Authentication System:** Separate, secure login endpoints (`/auth/admin/login` and `/auth/login`) for Administrators and Employees.
* **Protected Routes:** All business logic routes are protected by a JWT authentication middleware.
* **Ride Management (Dispatch Logic):**
    * Employees can `POST` new ride requests, including scheduled rides.
    * Backend validates business logic (e.g., must be 1 hour in advance).
    * Admins can `GET` rides with filters (e.g., `?status=pending`).
    * Admins can `PUT` updates to rides (e.g., assign a `driver_id` and change `status` to 'accepted').
* **CRUD for Core Entities:** Full Create, Read, Update & Delete operations for:
    * `Drivers`
    * `Companies`
    * `Employees`
* **Admin Management:** Secure endpoints for admins to change their own passwords.

---

### 🏁 Getting Started

To run this server locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Digao075/Taxi_Saas_Backend.git](https://github.com/Digao075/Taxi_Saas_Backend.git)
    cd Taxi_Saas_Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Environment (.env) file:**
    Create a `.env` file in the root of the project and add your configuration:
    ```env
    PORT=3333

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_postgres_user
    DB_PASSWORD=your_postgres_password
    DB_DATABASE=taxiservice

    JWT_SECRET=gestaxiapi
    ```

4.  **Set up the PostgreSQL Database:**
    * Ensure you have PostgreSQL running.
    * Create the `taxiservice` database.
    * Run the necessary `CREATE TABLE` scripts for `admins`, `companies`, `drivers`, `employees`, and `rides`.
    * *Note: You must manually insert at least one admin to be able to log in.* (Or run the `create-admin.js` script we built).

5.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3333`.
