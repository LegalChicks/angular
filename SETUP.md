# Setup Guide: Connecting Frontend to Backend

This guide will help you set up and run both the frontend and backend servers.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file (on Windows)
copy .env.example .env

# Or on Mac/Linux
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Important:** Change `JWT_SECRET` to a strong random string!

### 4. Start the backend server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The backend will be available at `http://localhost:3001`

## Frontend Setup

### 1. Navigate to project root

```bash
cd ..  # If you're in the backend directory
```

### 2. Install dependencies (if not already done)

```bash
npm install
```

### 3. Update API Configuration (if needed)

The API base URL is configured in `src/config/api.config.ts`. By default, it's set to:

```typescript
baseUrl: 'http://localhost:3001/api'
```

If your backend runs on a different port or URL, update this file.

### 4. Start the frontend development server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the Connection

1. **Start both servers:**
   - Backend: `cd backend && npm run dev`
   - Frontend: `npm run dev` (in root directory)

2. **Test login:**
   - Go to `http://localhost:3000/login`
   - Use these test credentials:
     - Email: `admin@legalchicks.vip`
     - Password: `admin`

3. **Check browser console:**
   - Open Developer Tools (F12)
   - Check for any CORS or connection errors
   - Network tab should show successful API calls

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Make sure the backend `.env` file has the correct `FRONTEND_URL`:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```

2. Restart the backend server after changing `.env`

### Connection Refused

If you see "Connection refused" errors:

1. Verify the backend server is running on port 3001
2. Check that `API_CONFIG.baseUrl` in `src/config/api.config.ts` matches your backend URL
3. Ensure no firewall is blocking the connection

### Authentication Not Working

1. Check that the JWT token is being stored in localStorage (DevTools > Application > Local Storage)
2. Verify the token is being sent in API requests (Network tab > Headers > Authorization)
3. Check backend console for any authentication errors

## Project Structure

```
.
├── backend/              # Node.js/Express backend server
│   ├── routes/          # API route handlers
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── src/                 # Angular frontend
│   ├── config/         # API configuration
│   ├── interceptors/   # HTTP interceptors
│   ├── services/       # API service classes
│   └── ...
└── package.json        # Frontend dependencies
```

## Next Steps

- [ ] Add error handling and user feedback for API errors
- [ ] Implement refresh tokens for better security
- [ ] Add loading states and error messages in components
- [ ] Set up environment-specific API URLs
- [ ] Add database integration to backend
- [ ] Implement password hashing in backend

## Support

For issues or questions, check:
- Backend documentation: `backend/README.md`
- Angular documentation: https://angular.io/docs
- Express documentation: https://expressjs.com/

