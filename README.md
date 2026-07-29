# SmartSpend

A modern **full-stack personal finance management application** built with the **MERN Stack** that helps users manage their income, expenses, budgets, and savings goals through an intuitive dashboard with real-time analytics.

###  Live Demo
> https://smart-spend-kohl.vercel.app/

### Backend API
> https://smartspend-production-2753.up.railway.app/


# Overview

SmartSpend is designed to simplify personal finance management by providing users with a secure platform to monitor their financial activities.

Users can:
- Track daily income and expenses
- Create monthly budgets
- Manage savings goals
- View financial analytics
- Export expense reports
- Access their data securely from anywhere

The application focuses on providing a clean, responsive, and user-friendly experience while implementing secure authentication and modern backend practices.

---

# Features

##  Authentication
- User Registration
- Secure Login
- Email Verification
- JWT Authentication
- Password Encryption (bcrypt)
- Protected Routes

##  Dashboard
- Total Income
- Total Expenses
- Net Balance
- Budget Overview
- Savings Summary
- Weekly Spending Analytics
- Recent Transactions

##  Expense Management
- Add Expenses
- Edit Expenses
- Delete Expenses
- Search Expenses
- Filter by Category
- Sort by Amount & Date
- Export Reports as PDF

##  Income Management
- Add Income
- Edit Income
- Delete Income
- Income History
- Automatic Balance Calculation

##  Budget Management
- Create Budgets
- Update Budgets
- Delete Budgets
- Budget Progress Tracking

## Savings Goals
- Create Goals
- Update Goals
- Delete Goals
- Target Amount
- Deadline Tracking
- Progress Monitoring

##  User Experience
- Fully Responsive Design
- Dark & Light Mode
- Smooth Animations
- Toast Notifications
- Confirmation Modals
- Loading Skeletons
- Clean Modern Interface

---

# Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router
- React Icons
- jsPDF
- jspdf-autotable

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- Brevo Email API
- dotenv

---

# 📁 Project Structure

```
SmartSpend
│
├── frontend
│   ├── assets
│   ├── components
│   ├── context
│   ├── pages
│   ├── services
│   └── App.jsx
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── README.md
```

---

# Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/SmartSpend.git
```

### Install Backend

```bash
cd backend
npm install
npm run dev
```

### Install Frontend

```bash
cd frontend
npm install
npm run dev
```

---

#  Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=

MONGODB_URI=

JWT_SECRET=

BREVO_API_KEY=

EMAIL_FROM=
```

---

#  Key Highlights

- Full-Stack MERN Application
- RESTful API Architecture
- Secure Authentication
- Email Verification
- MongoDB Aggregation
- Interactive Dashboard
- Budget & Savings Management
- Expense Report Export (PDF)
- Responsive UI
- Dark Mode Support

---

#  Future Enhancements

- AI Spending Insights
- Recurring Transactions
- Multi-Currency Support
- Bill Reminders
- CSV Import & Export
- Mobile Application
- Smart Budget Recommendations

---

#  Learning Outcomes

This project strengthened my understanding of:

- MERN Stack Development
- REST API Design
- Authentication & Authorization
- MongoDB Aggregation Pipeline
- CRUD Operations
- State Management
- Responsive UI Design
- Backend Security
- Dashboard Analytics

---

# 👩‍💻 Author

**Tania Zubair**

BS Information Technology

If you found this project useful, consider giving it a ⭐ on GitHub.