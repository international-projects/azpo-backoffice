# Backoffice Setup Guide

## Environment Configuration

To connect the backoffice to your NestJS backend, create a `.env.local` file in the backoffice directory with the following content:

```env
# Backend API URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Asset URL (if needed)
NEXT_PUBLIC_ASSET_URL=

# Base path (if needed)
NEXT_PUBLIC_BASE_PATH=
```

## Running the Application

1. **Start the Backend (NestJS)**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Backoffice (Next.js)**
   ```bash
   cd backoffice
   npm install
   npm run dev
   ```
   The backoffice will run on `http://localhost:3001`

## Login Implementation

The login functionality has been implemented with the following features:

- **API Endpoint**: `/auth/login` (POST)
- **Request Format**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Format**:
  ```json
  {
    "user": { /* user data */ },
    "access_token": "jwt_token_here"
  }
  ```

## Authentication Flow

1. User enters email and password
2. Frontend sends POST request to `/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in session storage
5. User is redirected to dashboard

## Next Steps

1. Create a test user in your backend database
2. Test the login functionality
3. Implement additional API endpoints as needed 