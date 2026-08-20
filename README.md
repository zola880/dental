# 🦷 Dental Clinic Management System

A production-ready, modern, and secure Dental Clinic Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). Designed to provide a premium, calm, and professional experience for clinic administrators, dentists, receptionists, and accountants.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### 👥 Role-Based Access Control (RBAC)
- **Admin**: Full system access including user management, settings, and audit logs
- **Dentist**: Patient records, treatment plans, appointments, prescriptions
- **Receptionist**: Patient registration, appointment scheduling, basic billing
- **Accountant**: Invoices, payments, expenses, financial reports

### 🏥 Core Modules
- **Patient Management**: Comprehensive profiles with medical/dental history
- **Appointment Scheduling**: Calendar views (day/week/month) with status tracking
- **Treatment Plans**: Multi-step treatment tracking with procedure records
- **Billing & Invoicing**: Dynamic line items, partial payments, payment history
- **Expense Tracking**: Categorized expenses with financial reporting
- **Financial Analytics**: Revenue trends, profit margins, service-wise breakdowns
- **Notifications**: Real-time notification center
- **Audit Logs**: Immutable activity tracking for compliance

### 🎨 Public Website
- Beautiful, responsive public website
- Services showcase
- Doctor profiles
- Online appointment booking
- Contact form with map integration

### 🔒 Security Features
- JWT authentication with HTTP-only cookies
- Role-based authorization on every endpoint
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Helmet security headers
- CORS protection
- Input validation with Zod (frontend) and express-validator (backend)
- Centralized error handling
- Audit logging for all critical operations

### 📊 Analytics & Reporting
- Interactive charts using Recharts
- Revenue trend analysis
- Service-wise revenue breakdown
- Expense vs. revenue comparison
- Dashboard statistics

## 🛠️ Technology Stack

### Frontend
- **React 18** with Hooks
- **Vite** for blazing-fast builds
- **React Router v6** for routing
- **React Hook Form** + **Zod** for forms & validation
- **TanStack Query** for server state management
- **Recharts** for data visualization
- **Lucide React** for consistent icons
- **Axios** for HTTP requests
- **Plain CSS** with CSS variables for the design system

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **express-rate-limit** for rate limiting
- **express-validator** for input validation
- **Winston** for structured logging

## 📂 Project Structure

```
dental/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment, DB, CORS configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, role, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Helpers, logger, error classes
│   │   ├── validators/     # Input validation schemas
│   │   ├── app.js          # Express app setup
│   │   ├── server.js       # Entry point
│   │   └── seed.js         # Database seeder
│   ├── .env.example
│   ├── Procfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── forms/      # Form components
│   │   │   ├── layout/     # Layout components
│   │   │   └── ui/         # Atomic UI components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route pages
│   │   │   ├── auth/       # Login, Register, ForgotPassword
│   │   │   ├── dashboard/  # Protected dashboard pages
│   │   │   └── public/     # Public website pages
│   │   ├── services/       # API client services
│   │   ├── styles/         # Global CSS & design system
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes.jsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret
npm run seed    # Seed database with sample data
npm run dev     # Start development server
```

**Default credentials after seeding:**
- Admin: `admin@dentalcare.com` / `Admin@123`
- Dentist: `dentist@dentalcare.com` / `Dentist@123`
- Receptionist: `receptionist@dentalcare.com` / `Reception@123`
- Accountant: `accountant@dentalcare.com` / `Account@123`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:5000/api/v1)
npm run dev     # Start development server
```

The frontend runs at `http://localhost:5173` and proxies API requests to the backend.

## 🚀 Production Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import the project into Vercel
3. Set environment variable: `VITE_API_URL` (your backend URL)
4. Deploy! The `vercel.json` handles SPA routing automatically.

### Backend (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Set environment variables:
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (a strong random string)
   - `CLIENT_URL` (your Vercel URL)
   - `NODE_ENV=production`
4. Deploy! The `Procfile` tells Render how to start the app.

### Database (MongoDB Atlas)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Copy the connection string to your backend's `MONGO_URI`

## 📡 API Architecture

All API responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

### Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `/api/v1/auth/*` | Login, register, logout |
| Users | `/api/v1/users/*` | User management |
| Patients | `/api/v1/patients/*` | Patient CRUD |
| Appointments | `/api/v1/appointments/*` | Appointment management |
| Treatments | `/api/v1/treatments/*` | Treatment plans & records |
| Dentists | `/api/v1/dentists/*` | Dentist profiles |
| Services | `/api/v1/services/*` | Service catalog |
| Invoices | `/api/v1/invoices/*` | Invoice management |
| Payments | `/api/v1/payments/*` | Payment tracking |
| Expenses | `/api/v1/expenses/*` | Expense tracking |
| Reports | `/api/v1/reports/*` | Financial analytics |
| Notifications | `/api/v1/notifications/*` | Notification center |
| Audit Logs | `/api/v1/audit-logs/*` | Activity tracking |
| Settings | `/api/v1/settings/*` | Clinic configuration |

## 🎨 Design System

The application uses a premium dental/medical color palette:
- **Primary**: Muted Teal (`#2A9D8F`)
- **Secondary**: Deep Natural Green (`#264653`)
- **Accent**: Warm Beige (`#E9C46A`)
- **Background**: Soft Ivory (`#FAFAFA`)

All colors, spacing, typography, and shadows are defined as CSS variables in `frontend/src/styles/variables.css`.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Git Workflow

This project follows a professional Git workflow:
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/stage-*` - Feature branches for each stage

All changes are made on feature branches and merged via Pull Requests.

## ⚠️ Medical Data Disclaimer

This application is built with strong privacy and security practices. However, it has **not been independently verified** for compliance with HIPAA, GDPR, or local healthcare data regulations. Professional legal review is required before handling real patient data in a production environment.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for modern dental practices**