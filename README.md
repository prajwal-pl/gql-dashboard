# GraphQL Dashboard

A full-stack web application providing a comprehensive dashboard solution built with modern web technologies. This project demonstrates a role-based authentication system, data visualization, and user profile management through a GraphQL API.

## Project Overview

The GraphQL Dashboard is a web application with a clean, modern interface that allows users to register, login, view dashboard statistics, and manage their profiles. The system implements role-based access control (RBAC) with teacher, student, and admin roles, each with specific permissions and access to different data views.

## Technology Stack

### Backend

- **Framework**: Express.js
- **API**: Apollo Server v5 with GraphQL
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Component Library**: shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Data Fetching**: Apollo Client
- **Form Handling**: react-hook-form with Zod validation
- **Data Visualization**: Recharts
- **Styling**: Tailwind CSS

## Features

- **Authentication System**:

  - User registration with role selection
  - Secure login with JWT
  - Protected routes with middleware guards

- **Dashboard**:

  - Interactive data visualization
  - Role-based data filtering
  - Date range selection
  - Search functionality
  - Animated statistics cards

- **User Profile Management**:

  - View and update profile information
  - Change password functionality
  - Bio information management

- **Security**:
  - Role-based access control
  - Protected API endpoints
  - Secure password handling
  - JWT authentication

## Project Structure

The project follows a monorepo-like structure with separate frontend and backend directories:

```
/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts         # Express + Apollo Server setup
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── schema.ts        # GraphQL schema definitions
│   │   └── resolvers.ts     # GraphQL resolvers
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/      # Authentication routes
    │   │   ├── (protected)/ # Protected routes
    │   │   └── page.tsx     # Landing page
    │   ├── components/
    │   │   └── ui/          # UI components
    │   ├── hooks/           # Custom React hooks
    │   └── lib/             # Utility functions and configuration
    ├── public/              # Static assets
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or cloud-based)

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=8000
   DATABASE_URL="your_mongodb_connection_string"
   JWT_SECRET="your_jwt_secret"
   ```

4. Generate Prisma client:

   ```
   npx prisma generate
   ```

5. Push the database schema:

   ```
   npx prisma db push
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Documentation

The GraphQL API provides the following operations:

### Queries

- `me`: Get the current authenticated user's profile
- `dashboardStats`: Get statistics for the dashboard display

### Mutations

- `register`: Create a new user account
- `login`: Authenticate a user and return a JWT
- `updateProfile`: Update a user's profile information
- `changePassword`: Update a user's password

## License

This project is licensed under the MIT License.

## Acknowledgements

This project utilizes several open-source libraries and tools that make modern web development efficient and enjoyable:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Apollo GraphQL](https://www.apollographql.com/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
