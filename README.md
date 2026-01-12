# Govenly

A comprehensive full-stack application for managing water, electricity, and gas utilities including customer management, billing, meter reading, payments, work orders, inventory, and HR/payroll.

## Project Structure

```
GOVENLY/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── guards/        # Auth guards (JWT, Roles)
│   │   │   ├── interfaces/    # TypeScript interfaces
│   │   │   └── strategies/    # Passport strategies
│   │   ├── common/            # Shared utilities
│   │   │   ├── decorators/    # Custom decorators
│   │   │   ├── dto/           # Shared DTOs
│   │   │   └── filters/       # Exception filters
│   │   ├── database/          # Database configuration
│   │   │   └── entities/      # TypeORM entities
│   │   ├── employees/         # Employee management module
│   │   │   └── dto/           # Employee DTOs
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                   # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   └── login/         # Login page
│   │   ├── components/        # React components
│   │   │   ├── layouts/       # Layout components
│   │   │   └── ui/            # UI components
│   │   ├── contexts/          # React contexts
│   │   ├── lib/               # Utility functions & API client
│   │   └── types/             # TypeScript types
│   ├── .env.local             # Environment variables
│   └── package.json
│
├── database/                   # Database scripts
│   └── seed.sql               # Seed data for testing
│
└── schema.sql                  # Database schema
```

## Tech Stack

### Backend

- **Framework:** NestJS 10
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** Microsoft SQL Server
- **Authentication:** JWT with Passport
- **Documentation:** Swagger/OpenAPI

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Microsoft SQL Server
- npm or yarn

### Database Setup

1. Create a new database called `UtilityManagementDB` in SQL Server

2. Run the schema script:

   ```sql
   -- Execute schema.sql in SQL Server Management Studio
   ```

3. Run the seed script for test users:
   ```sql
   -- Execute database/seed.sql
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:

   ```env
   # For Windows Authentication
   DB_HOST=localhost
   DB_PORT=1433
   DB_DATABASE=UtilityManagementDB
   DB_TRUST_SERVER_CERTIFICATE=true

   # For SQL Server Authentication (uncomment and set)
   # DB_USERNAME=your_username
   # DB_PASSWORD=your_password

   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=8h
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run start:dev
   ```

5. Access Swagger documentation at: http://localhost:3001/api/docs

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the application at: http://localhost:3000

## Test Users

After running the seed script, you can login with these accounts:

| Username     | Password    | Role         |
| ------------ | ----------- | ------------ |
| akarunaratne        | password123 | Admin        |
| nperera      | password123 | Manager      |
| msenanayake      | password123 | Cashier      |
| krajapaksa | password123 | FieldOfficer |
| kdissanayak  | password123 | MeterReader  |

