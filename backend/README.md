# TailorApp Backend API

RESTful API backend for the TailorApp mobile application, built with Node.js, Express, and MongoDB.

## Features

- 📱 Phone number authentication with OTP verification
- 🔐 JWT-based authentication and authorization
- 👥 User role management (Customer/Tailor)
- 💼 Subscription management for tailors
- 🌍 Location-based services
- 📊 Rate limiting and security middleware
- 🔧 Environment-based configuration

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt for password hashing
- **SMS Service**: Twilio (configurable)
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: express-validator

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Twilio account (for SMS functionality)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /send-otp` - Send OTP to phone number
- `POST /verify-otp` - Verify OTP and login
- `POST /onboarding` - Complete user onboarding (protected)
- `GET /profile` - Get current user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `POST /logout` - Logout user (protected)
- `GET /health` - Auth service health check

### General Routes

- `GET /health` - API health check
- `GET /api` - API information

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tailorapp
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
FRONTEND_URL=http://localhost:3000
```

## User Roles

### Customer
- Browse tailors and fabrics
- Place orders
- Manage measurements
- Track order status

### Tailor/Boutique
- Manage fabric inventory
- Handle customer orders
- Subscription-based access
- Customer management

## Security Features

- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Helmet for security headers
- CORS configuration
- JWT token authentication
- Password hashing with bcrypt

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # Express routes
├── services/        # Business logic services
└── utils/           # Utility functions
```

## License

MIT License