# Troubleshooting Guide

## Common Issues and Solutions

---

## 1. Network Error on Login

### Symptom
When attempting to login on the frontend, users see a "Network Error" message instead of being authenticated.

### Root Causes

#### 1.1 Backend Server Not Running
**Error:** `Failed to connect to localhost port 3001: Connection refused`

**Solution:**
```bash
cd backend
npm run start:dev
```

#### 1.2 Database Port Configuration Error
**Error:** 
```
TypeError: The "config.options.port" property must be of type number.
```

**Cause:** 
The `DB_PORT` environment variable is read as a string from the `.env` file, but the SQL Server driver (tedious) requires it to be a number.

**Location:** `backend/src/app.module.ts`

**Incorrect Code:**
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mssql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 1433),  // ❌ Returns string, not number
    // ...
  }),
  inject: [ConfigService],
}),
```

**Fixed Code:**
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mssql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: parseInt(configService.get<string>('DB_PORT', '1433'), 10),  // ✅ Explicitly parse to integer
    // ...
  }),
  inject: [ConfigService],
}),
```

**Explanation:**
- `ConfigService.get<number>()` does NOT automatically convert strings to numbers
- Environment variables are always strings when read from `.env` files
- Must explicitly parse numeric values using `parseInt()` or `Number()`

#### 1.3 Missing Frontend Environment File
**Error:** API calls go to wrong URL or fail silently

**Solution:**
Create `frontend/.env.local`:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

#### 1.4 Database Connection Failed
**Error:**
```
Unable to connect to the database. Retrying...
```

**Possible Causes:**
1. SQL Server not running
2. Wrong credentials in `.env`
3. Database doesn't exist
4. Firewall blocking port 1433

**Solution:**
1. Verify SQL Server is running:
   ```bash
   # Check if SQL Server is listening
   netstat -an | grep 1433
   ```

2. Verify `.env` configuration:
   ```properties
   DB_HOST=localhost
   DB_PORT=1433
   DB_USERNAME=sa
   DB_PASSWORD=YourPassword
   DB_DATABASE=GOVTUTIL8
   DB_TRUST_SERVER_CERTIFICATE=true
   ```

3. Test connection manually:
   ```bash
   # Using sqlcmd (if installed)
   sqlcmd -S localhost -U sa -P YourPassword -d GOVTUTIL8
   ```

---

## 2. CORS Errors

### Symptom
Browser console shows:
```
Access to XMLHttpRequest at 'http://localhost:3001/api/v1/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

### Solution
Ensure `CORS_ORIGIN` in `backend/.env` matches your frontend URL:
```properties
CORS_ORIGIN=http://localhost:3000
```

---

## 3. JWT Authentication Errors

### Symptom
- 401 Unauthorized errors after login
- Token not being sent with requests

### Possible Causes

#### 3.1 Token Not Stored
Check browser developer tools → Application → Cookies to verify `auth_token` is set.

#### 3.2 Token Expired
Default expiration is 8 hours. Check `JWT_EXPIRES_IN` in `.env`:
```properties
JWT_EXPIRES_IN=8h
```

#### 3.3 Invalid JWT Secret
Ensure `JWT_SECRET` is the same across server restarts:
```properties
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

---

## 4. Quick Diagnostic Commands

### Check if Backend is Running
```bash
curl http://localhost:3001/api/v1/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"password123"}'
```

### Expected Successful Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "employee": {
      "employeeId": 1,
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@utility.gov",
      "role": "Admin"
    }
  }
}
```

### Check Backend Logs
Look at the terminal where `npm run start:dev` is running for:
- Database connection errors
- Query logs
- Authentication errors

---

## 5. Environment Setup Checklist

### Backend (`backend/.env`)
```properties
# Required
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourPassword
DB_DATABASE=GOVTUTIL8
DB_TRUST_SERVER_CERTIFICATE=true
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=8h
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Optional (for Stripe payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (`frontend/.env.local`)
```properties
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## 6. Startup Order

1. **Start SQL Server** (must be running first)
2. **Start Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```
   Wait for: `🚀 Application is running on: http://localhost:3001`

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Wait for: `✓ Ready in Xs`

4. **Access Application:**
   Open `http://localhost:3000/login`

---

## 7. Test Credentials

| Username     | Password    | Role         |
|--------------|-------------|--------------|
| admin        | password123 | Admin        |
| manager      | password123 | Manager      |
| cashier      | password123 | Cashier      |
| fieldofficer | password123 | FieldOfficer |
| meterreader  | password123 | MeterReader  |

---

## 8. Common NestJS ConfigService Gotchas

### Environment Variables are Always Strings
```typescript
// ❌ Wrong - doesn't convert to number
const port = configService.get<number>('PORT'); // Still a string!

// ✅ Correct - explicitly convert
const port = parseInt(configService.get<string>('PORT', '3001'), 10);

// ✅ Also correct - use Number()
const port = Number(configService.get('PORT')) || 3001;
```

### Boolean Values
```typescript
// ❌ Wrong
const flag = configService.get<boolean>('FEATURE_FLAG'); // Returns string "true"

// ✅ Correct
const flag = configService.get<string>('FEATURE_FLAG') === 'true';
```

---

## Need More Help?

1. Check the Swagger documentation: `http://localhost:3001/api/docs`
2. Review backend console logs for detailed error messages
3. Check browser Network tab for API request/response details
