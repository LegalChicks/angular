# Legal Chicks Empowerment Network - Backend Server

A Node.js/Express backend server for the Legal Chicks Empowerment Network Portal.

## Features

- ✅ RESTful API endpoints
- ✅ JWT-based authentication
- ✅ User management (members, profiles)
- ✅ Business data (invoices, expenses, profitability)
- ✅ Analytics data
- ✅ CORS enabled for frontend integration
- ✅ Environment variable configuration

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/members` - Get all members (requires auth)
- `GET /api/users/profile/:id` - Get user profile (requires auth)
- `PUT /api/users/profile/:id` - Update user profile (requires auth)

### Business
- `GET /api/business/invoices` - Get all invoices (requires auth)
- `GET /api/business/expenses` - Get all expenses (requires auth)
- `POST /api/business/expenses` - Add new expense (requires auth)
- `GET /api/business/profitability` - Get profitability data (requires auth)

### Analytics
- `GET /api/analytics` - Get analytics data (requires auth)

### Health Check
- `GET /api/health` - Server health check

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

### 3. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

## API Usage Examples

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@legalchicks.vip","password":"admin"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@legalchicks.vip",
    "role": "admin",
    "visibility": "public"
  }
}
```

### Get Members (Authenticated Request)

```bash
curl -X GET http://localhost:3001/api/users/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Connecting Frontend to Backend

Update your Angular services to make HTTP requests to the backend API. For example, in `auth.service.ts`:

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

const API_URL = 'http://localhost:3001/api';

async login(email: string, password: string) {
  return this.http.post<{success: boolean, message: string, token: string, user: User}>(
    `${API_URL}/auth/login`,
    { email, password }
  ).toPromise();
}
```

## Security Notes

⚠️ **This is a basic implementation for development. For production:**

1. **Hash passwords** using bcrypt (currently passwords are stored in plain text)
2. **Use a real database** (MongoDB, PostgreSQL, etc.) instead of in-memory arrays
3. **Add input validation** (consider using libraries like `express-validator`)
4. **Implement rate limiting** to prevent abuse
5. **Add HTTPS** for secure connections
6. **Store JWT_SECRET** securely (use environment variables, not in code)
7. **Add proper error handling** and logging
8. **Implement refresh tokens** for better security

## Next Steps

- [ ] Set up a database (MongoDB, PostgreSQL, etc.)
- [ ] Implement password hashing with bcrypt
- [ ] Add input validation and sanitization
- [ ] Add rate limiting
- [ ] Set up proper logging
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

## License

ISC

