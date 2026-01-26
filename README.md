# 🏫 EduERP Backend System

> **A Comprehensive, Scalable School Management & Billing Engine.**
> Built with Node.js, Express, TypeScript, and MongoDB.

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

## 🌟 Overview

EduERP is a multi-tenant backend system designed to manage the end-to-end operations of schools and coaching institutes. It focuses heavily on **Financial Management** (Fees, Invoices, Payments) while providing a robust foundation for **Academic Management** (Students, Classes, Academic Years).

The system is built with a **Modular Architecture**, making it highly scalable and easy for new developers to extend.

---

## 🏗️ Architecture & Folder Structure

We follow a **Module-First** approach. Each feature is self-contained within `src/modules/{featureName}` containing its own Controller, Service, Model, and Routes.

```bash
src/
├── 📂 config/           # Environment, Database, Payment Configs
├── 📂 jobs/             # Background Cron Jobs (Invoicing, Reminders)
├── 📂 middlewares/      # Auth, RBAC, School Scoping
├── 📂 modules/          # 🧩 CORE LOGIC (See below)
│   ├── 🔐 auth/         # Login, OTP, Refresh Tokens
│   ├── 🏛️ schools/      # School Profile, Settings, Branding
│   ├── 👨‍💼 super-admin/  # Platform Admin (SaaS features)
│   ├── 📅 academic/     # Academic Years (2024-25, etc.)
│   ├── 🏫 classes/      # Class & Section Management
│   ├── 🎓 students/     # Admissions, Profiles
│   ├── 💰 fees/         # Fee Heads, Structures
│   ├── 🧾 invoices/     # Generator Engine, Manual Invoices
│   ├── 💳 payments/     # Razorpay, Webhooks, Receipts
│   ├── 📊 reports/      # Collections, Dues Reporting
│   └── 🔔 notifications/# Email Service, Logs
├── 📂 utils/            # Helpers, Validators (Joi), Responses
├── app.ts               # Express App Setup
└── server.ts            # Entry Point
```

---

## ⚡ System Flow & Mental Model

Everything in EduERP revolves around the **School** context.

1.  **Super Admin** creates a **School** and assigns a **Subscription Plan**.
2.  **School Admin** sets up the **Academic Year** (e.g., 2024-2025).
3.  **School Admin** creates **Classes** and **Sections**.
4.  **School Admin** defines **Fee Structures** (e.g., "Class 10 Fees") with installments.
5.  **Students** are admitted and assigned to a Class & Fee Structure.
6.  **Invoice Engine** (Cron/Manual) generates invoices based on the fee plan.
7.  **Parents** pay via **Payment Gateway** (Razorpay).
8.  **Webhooks** verify payment -> Mark Invoice PAID -> Generate **Receipt**.

---

## 🛤️ Development Phases (Features)

The project was built in **9 Strategic Phases**. Here is what each phase handles:

### 🔹 Phase 1: Foundation & Models
*   **Goal**: Database Design.
*   **Details**: Created 13 Mongoose models (Student, Invoice, FeeStructure, etc.) ensuring strict typing and relationships.
*   **Key Files**: `src/modules/*/*.model.ts`

### 🔹 Phase 2: Authentication & Authorization
*   **Goal**: Secure Access.
*   **Details**: 
    *   JWT-based Auth (Access + Refresh Tokens).
    *   **RBAC**: Middleware to restrict routes (`restrictTo('school_admin')`).
    *   **School Scoping**: `scopeSchool` middleware automatically isolates data per school.
*   **Key Files**: `auth.controller.ts`, `auth.middleware.ts`.

### 🔹 Phase 3: Super Admin Module
*   **Goal**: SaaS Management.
*   **Details**: APIs to onboard new schools, manage subscription plans, and view platform revenue.
*   **Key Files**: `super-admin.service.ts`.

### 🔹 Phase 4: School Management
*   **Goal**: Academic Setup.
*   **Details**: 
    *   Manage **Academic Years** (Critical for promotion).
    *   Create **Classes** and **Sections**.
    *   Update School Branding (Logo, GST, Address).
*   **Key Files**: `academic.controller.ts`, `class.service.ts`.

### 🔹 Phase 5: Student Management
*   **Goal**: Admissions.
*   **Details**: 
    *   **Admit Student**: Validation checks (Unique duplicate check).
    *   **Bulk Import**: API to load students from JSON/CSV.
    *   **Student Profile**: Parents info, contact details.
*   **Key Files**: `student.service.ts`, `student.controller.ts`.

### 🔹 Phase 6: Fee Management
*   **Goal**: Billing Logic.
*   **Details**: 
    *   **Fee Heads**: Components like "Tuition Fee", "Transport".
    *   **Fee Structures**: Complex plans with **Installments** (Q1, Q2, etc.).
    *   **Invoice Generator**: Smart engine to generate invoices for entire classes.
    *   **Manual Invoices**: Ad-hoc invoice creation.
*   **Key Files**: `fee-structure.model.ts`, `invoice-generator.ts`.

### 🔹 Phase 7: Payment Integration
*   **Goal**: Collections.
*   **Details**: 
    *   **Razorpay**: Order creation API.
    *   **Webhooks**: Securely handle `payment.captured` events to update DB.
    *   **Receipts**: Immutable receipt generation upon success.
*   **Key Files**: `payment.service.ts`, `webhook.handler.ts`.

### 🔹 Phase 8: Reports & Notifications
*   **Goal**: Insights.
*   **Details**: 
    *   **Reports**: Daily Collection, Monthly Collection, Outstanding Dues.
    *   **Notifications**: Email service (Nodemailer) for sending Invoices/Receipts.
    *   **Activity Logs**: Audit trail for sensitive actions.
*   **Key Files**: `report.service.ts`, `email.service.ts`.

### 🔹 Phase 9: Background Jobs
*   **Goal**: Automation.
*   **Details**: 
    *   `node-cron` implementation.
    *   **Auto-Invoice**: Generates upcoming invoices 15 days prior.
    *   **Late Fee**: Auto-applies penalties on overdue invoices.
    *   **Reminders**: Sends email alerts for due fees.
*   **Key Files**: `src/jobs/*.ts`.

---

## 🚀 Getting Started for Developers

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Redis (Optional, for future caching)

### Installation

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/anmolbisht2308/eduERP-backend.git
    cd eduERP-backend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root:
    ```env
    PORT=5000
    NODE_ENV=development
    MONGO_URI=mongodb://localhost:27017/eduerp
    
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=1d
    JWT_REFRESH_SECRET=your_super_secret_refresh_key
    JWT_REFRESH_EXPIRES_IN=7d
    
    RAZORPAY_KEY_ID=your_rzp_id
    RAZORPAY_KEY_SECRET=your_rzp_secret
    RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
    
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email
    SMTP_PASS=your_app_password
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

### How to Add a New Module?

1.  Create a folder in `src/modules/` (e.g., `library`).
2.  Create `library.model.ts`, `library.service.ts`, `library.controller.ts`, `library.routes.ts`.
3.  Register routes in `src/routes.ts`.
4.  Add validation schemas in `src/utils/validation.ts`.

---

## 🧪 Testing

Run standard tests (Coming Soon):
```bash
npm test
```

## 🤝 Contribution

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

---

## 📚 API Reference

Here is a detailed guide to the available API endpoints.

> **Base URL**: `/api/v1`

<details>
<summary><b>🔐 Authentication (Auth)</b></summary>

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "admin@school.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": { ... }
  }
}
```

### Refresh Token
**POST** `/auth/refresh-token`
*Requires `refreshToken` cookie.*

</details>


<details>
<summary><b>👨‍💼 Super Admin Module</b></summary>

### Create New School
**POST** `/super-admin/schools`

**Body:**
```json
{
  "school": {
    "name": "Delhi Public School",
    "address": "Generic Street, Delhi",
    "contactEmail": "info@dps.com",
    "contactPhone": "9999999999"
  },
  "admin": {
    "firstName": "Principal",
    "lastName": "Sharma",
    "email": "admin@dps.com",
    "password": "securePass123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "school": { "_id": "65b...", "name": "Delhi Public School" },
    "admin": { "_id": "65b...", "role": "school_admin" }
  }
}
```

</details>


<details>
<summary><b>🏫 School Management</b></summary>

### Create Academic Year
**POST** `/academic-years`

**Body:**
```json
{
  "name": "2024-2025",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "isCurrent": true
}
```

### Create Class
**POST** `/classes`

**Body:**
```json
{
  "name": "Class 10",
  "displayOrder": 10,
  "academicYearId": "65b..."
}
```

### Create Section
**POST** `/classes/sections`

**Body:**
```json
{
  "name": "Section A",
  "classId": "65b...",
  "academicYearId": "65b..."
}
```

</details>


<details>
<summary><b>🎓 Student Management</b></summary>

### Admit Student
**POST** `/students`

**Body:**
```json
{
  "firstName": "Rahul",
  "lastName": "Verma",
  "admissionNumber": "ADM-2024-001",
  "classId": "65b...",
  "sectionId": "65b...",
  "academicYearId": "65b...",
  "parentName": "Mr. Verma",
  "parentPhone": "9876543210",
  "gender": "male"
}
```

### Bulk Import
**POST** `/students/bulk-import`

**Body:**
```json
{
  "students": [
    { "firstName": "Alice", "admissionNumber": "A001", ... },
    { "firstName": "Bob", "admissionNumber": "A002", ... }
  ]
}
```

</details>


<details>
<summary><b>💰 Fee & Invoices</b></summary>

### Create Fee Structure
**POST** `/fees/structures`

**Body:**
```json
{
  "name": "Class 10 - Annual Fee",
  "academicYearId": "65b...",
  "classId": "65b...",
  "frequency": "quarterly",
  "amount": 40000,
  "feeComponents": [
    { "feeHeadId": "65b...", "amount": 30000 }, // Tuition
    { "feeHeadId": "65b...", "amount": 10000 }  // Lab
  ],
  "installments": [
    { "name": "Q1", "dueDate": "2024-04-10", "amount": 10000 },
    { "name": "Q2", "dueDate": "2024-07-10", "amount": 10000 },
    { "name": "Q3", "dueDate": "2024-10-10", "amount": 10000 },
    { "name": "Q4", "dueDate": "2025-01-10", "amount": 10000 }
  ]
}
```

### Bulk Generate Invoices
**POST** `/invoices/generate-bulk`

**Body:**
```json
{
  "classId": "65b...",
  "feeStructureId": "65b...",
  "academicYearId": "65b...",
  "installmentName": "Q1"
}
```

</details>


<details>
<summary><b>💳 Payments</b></summary>

### Initiate Payment
**POST** `/payments/initiate`

**Body:**
```json
{
  "invoiceId": "65b...",
  "amount": 10000,
  "paymentMethod": "online"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": { "id": "order_N2...", "amount": 1000000, "currency": "INR" },
    "keyId": "rzp_test..."
  }
}
```

</details>

