# SmartSpend

SmartSpend is a full-stack personal finance management application that helps users manage their expenses, budgets, and savings efficiently. The application provides a secure and user-friendly platform for tracking financial activities and analysing spending patterns.

---

# Features

* User Registration and Login
* JWT Authentication
* Change Password
* Add, Edit and Delete Expenses
* Expense Categorisation
* Budget Management
* Savings Goals Management
* Dashboard with Spending Analytics
* Monthly Expense Summary
* Export Expense Reports to PDF
* Responsive User Interface
* Dark Mode and Light Mode

---

# Tech Stack

## Frontend

* React.js (Vite)
* React Router
* Axios
* Tailwind CSS
* Framer Motion
* React Icons

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Token (JWT)
* bcrypt.js
* dotenv

---

# Project Structure

```text
SmartSpend/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/SmartSpend.git
```

## Navigate to the Project

```bash
cd SmartSpend
```

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server.

```bash
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The backend runs on:

```text
http://https://smartspend-production-2753.up.railway.app
```

---

# Security

* Passwords are hashed using bcrypt.js.
* JWT-based authentication is used to secure user sessions.
* Protected API routes restrict unauthorised access.
* Environment variables are used to store sensitive configuration values.

---

# Future Enhancements

* AI-powered expense insights
* Receipt scanning with OCR
* Email notifications
* Multi-currency support
* Recurring expense management
* Advanced charts and reports

---

# Author

**Tania Zubair**

GitHub: https://github.com/taniazubair

---

# License

This project is developed for educational and portfolio purposes.
