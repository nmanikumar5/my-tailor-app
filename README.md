# TailorApp

A comprehensive mobile application connecting customers with tailors and boutiques, built with React Native and Node.js.

## 🚀 Features Implemented

### ✅ Complete Authentication System
- **Phone/OTP Authentication**: Secure phone number verification with OTP
- **User Onboarding**: Role selection (Customer/Tailor) with profile completion
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Persistent Login**: Users stay logged in across app restarts
- **Role-based Navigation**: Different app flows for customers and tailors

### ✅ Frontend Foundation
- **React Native + TypeScript**: Type-safe mobile development
- **React Navigation**: Stack and tab navigation with authentication flow
- **Theming System**: Light/dark mode with TailorApp brand colors
- **State Management**: React Context for authentication and theme
- **Responsive UI**: Modern, accessible design components
- **Form Validation**: Client-side validation with loading states

### ✅ Backend Foundation
- **Node.js + Express**: RESTful API with ES modules
- **MongoDB + Mongoose**: Document database with user management
- **Authentication Middleware**: JWT-based auth with role permissions
- **Security Features**: Rate limiting, CORS, input validation, helmet
- **SMS Integration**: OTP delivery via Twilio (configurable)
- **Environment Management**: Secure configuration handling

## 🏗️ Architecture

### Frontend (`/`)
```
src/
├── components/          # Reusable UI components (ready)
├── contexts/           # React Context providers
├── navigation/         # React Navigation setup
├── screens/           # Screen components
├── services/          # API integration services
├── theme/             # Theming system
├── types/             # TypeScript definitions (ready)
└── utils/             # Utility functions (ready)
```

### Backend (`/backend`)
```
src/
├── config/            # Environment & database config
├── controllers/       # Route controllers
├── middleware/        # Auth, validation, error handling
├── models/           # MongoDB/Mongoose models
├── routes/           # Express routes
├── services/         # Business logic services
└── utils/            # Validation schemas & helpers
```

## 🔧 Getting Started

### Prerequisites
- Node.js (v16+)
- React Native development environment
- MongoDB (local or cloud)
- Twilio account (optional, for SMS)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev  # Development server
npm start    # Production server
```

### Frontend Setup
```bash
npm install
npm start    # Metro bundler
npm run android  # Android app
npm run ios      # iOS app
```

## 📱 Authentication Flow

1. **Phone Login**: User enters phone number
2. **OTP Verification**: 6-digit code sent via SMS (logged in dev mode)
3. **Onboarding**: Name, role selection, business details (for tailors)
4. **Dashboard**: Role-based navigation to appropriate features

## 🎨 User Roles

### Customer Features (UI Ready)
- Browse tailors and fabrics
- Manage measurements
- Place orders
- Track order status

### Tailor/Boutique Features (UI Ready)
- Dashboard with subscription management
- Customer management
- Fabric inventory management
- Order processing

## 🔐 API Endpoints

### Authentication (`/api/auth`)
- `POST /send-otp` - Send verification code
- `POST /verify-otp` - Verify code and login
- `POST /onboarding` - Complete user profile
- `GET /profile` - Get current user
- `PUT /profile` - Update user profile
- `POST /logout` - Logout user

### Health Check
- `GET /health` - API status
- `GET /api/auth/health` - Auth service status

## 🛠️ Development

### Frontend Scripts
- `npm start` - Start Metro bundler
- `npm test` - Run Jest tests
- `npm run lint` - ESLint checks
- `npm run android` - Build Android
- `npm run ios` - Build iOS

### Backend Scripts
- `npm run dev` - Development with nodemon
- `npm start` - Production server
- `npm run lint` - ESLint checks
- `npm run format` - Prettier formatting

## 🧪 Testing

- **Frontend**: Jest + React Native Testing Library
- **Mocking**: Navigation, AsyncStorage, API calls
- **Backend**: Ready for unit and integration tests

## 🔒 Security Features

- JWT authentication with configurable expiration
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers

## 🚀 Next Steps

The foundation is complete! Ready for implementing:

1. **Core Features**: Fabric management, measurements, orders
2. **Real-time Features**: Chat system, notifications
3. **Location Services**: Nearby tailors, delivery tracking
4. **Payment Integration**: Subscription management, order payments
5. **Advanced Features**: AI measurements, AR try-on

## 📄 License

MIT License - see LICENSE file for details

---

**Status**: ✅ Authentication system fully functional with end-to-end integration between React Native frontend and Node.js backend.