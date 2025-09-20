# TailorApp Development Guide

## 🧪 Testing the Authentication System

### Backend API Testing

1. **Start MongoDB (using Docker - recommended):**
   ```bash
   # From the project root directory
   docker compose up -d mongodb
   ```
   
   **Alternative**: Install MongoDB locally or use MongoDB Atlas

2. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   Server should start on `http://localhost:5000`

2. **Test API endpoints with curl:**

   **Health check:**
   ```bash
   curl http://localhost:5000/health
   ```

   **Send OTP:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+1234567890"}'
   ```
   
   **Verify OTP (use the 6-digit code from console logs):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+1234567890", "otp": "123456"}'
   ```

3. **Check console logs for OTP codes:**
   In development mode, OTP codes are logged to the console instead of being sent via SMS.

### Frontend Mobile App Testing

1. **Start the React Native app:**
   ```bash
   npm start
   npm run android  # or npm run ios
   ```

2. **Test authentication flow:**
   - Enter a phone number (any format)
   - Click "Send OTP" 
   - Check the backend console for the OTP code
   - Enter the 6-digit OTP
   - Complete onboarding form
   - App should navigate to the appropriate dashboard

3. **Test persistent login:**
   - Close and reopen the app
   - Should automatically log in and show dashboard

### Environment Configuration

#### Backend (.env file)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tailorapp
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
```

#### Frontend (src/services/apiClient.ts)
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Development Workflow

1. **Backend changes:**
   ```bash
   cd backend
   npm run dev  # Auto-restart on changes
   ```

2. **Frontend changes:**
   ```bash
   npm start  # Metro bundler
   # In another terminal:
   npm run android  # Hot reload enabled
   ```

3. **Run tests:**
   ```bash
   # Frontend tests
   npm test
   
   # Backend tests (when implemented)
   cd backend && npm test
   ```

### Troubleshooting

#### Common Issues:

1. **"Network request failed" in app:**
   - Check backend server is running
   - Verify API_BASE_URL in apiClient.ts
   - For Android emulator: use `http://10.0.2.2:5000/api`

2. **MongoDB connection failed:**
   - **Recommended**: Use Docker to start MongoDB:
     ```bash
     docker compose up -d mongodb
     ```
   - **Alternative 1**: Install and start MongoDB locally
   - **Alternative 2**: Use MongoDB Atlas cloud database and update `MONGODB_URI` in `.env`

3. **OTP not received:**
   - In development, OTP is logged to backend console
   - Check backend logs for the 6-digit code

4. **App crashes on AsyncStorage:**
   - Clear app data/cache
   - Uninstall and reinstall the app

### API Response Examples

**Successful OTP send:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phoneNumber": "+1234567890",
    "expiresAt": "2023-12-01T12:10:00.000Z"
  }
}
```

**Successful OTP verification:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "65...",
      "phoneNumber": "+1234567890",
      "role": "customer",
      "needsOnboarding": true
    }
  }
}
```

### Database Schema

**User Document Example:**
```json
{
  "_id": "ObjectId(...)",
  "phoneNumber": "+1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "role": "tailor",
  "businessName": "John's Tailoring",
  "isPhoneVerified": true,
  "subscription": {
    "plan": "trial",
    "isActive": true,
    "endDate": "2023-12-08T..."
  },
  "createdAt": "2023-12-01T...",
  "updatedAt": "2023-12-01T..."
}
```