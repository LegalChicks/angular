# Member Registration Guide

This document explains how member registration works in the Legal Chicks Empowerment Network Portal.

## Registration Flow

### Frontend (`src/features/auth/register/`)

1. **User fills out the registration form:**
   - Full Name (required)
   - Email Address (required, must be valid email format)
   - Password (required, minimum 8 characters)
   - Confirm Password (required, must match password)
   - Agreement to Cooperative Pledge (required checkbox)

2. **Form Validation:**
   - Real-time validation with visual feedback
   - Red borders for invalid fields
   - Green borders for valid fields
   - Error messages shown below each field

3. **Submission Process:**
   - Form validates all fields before submission
   - Shows loading state during API call
   - Displays success/error messages
   - On success: automatically logs in user and redirects to dashboard

### Backend (`backend/routes/auth.js`)

1. **Endpoint:** `POST /api/auth/register`

2. **Request Body:**
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securepassword123"
   }
   ```

3. **Validation:**
   - Checks for missing fields
   - Verifies email doesn't already exist
   - Creates new user with role 'member' and visibility 'private'

4. **Response (Success - 201):**
   ```json
   {
     "success": true,
     "message": "Registration successful! Please check your email for a verification link.",
     "token": "jwt-token-here",
     "user": {
       "id": "7",
       "name": "John Doe",
       "email": "john@example.com",
       "role": "member",
       "visibility": "private"
     }
   }
   ```

5. **Response (Error - 400):**
   ```json
   {
     "success": false,
     "message": "An account with this email already exists."
   }
   ```

## Registration Features

### Validation Rules

- **Full Name:** Required field
- **Email:** Required, must be valid email format
- **Password:** Required, minimum 8 characters
- **Confirm Password:** Required, must match password
- **Terms Agreement:** Must be checked

### Security Features

- ✅ Password strength requirement (minimum 8 characters)
- ✅ Password confirmation validation
- ✅ Email uniqueness check
- ✅ JWT token generated upon successful registration
- ✅ User automatically authenticated after registration
- ✅ Detailed error logging (without exposing passwords)

### User Experience

- ✅ Real-time form validation
- ✅ Visual feedback (red/green borders)
- ✅ Loading states during submission
- ✅ Clear error messages
- ✅ Success confirmation screen
- ✅ Automatic login after registration
- ✅ Redirect to dashboard upon success

## Testing Registration

### Test Credentials (for testing purposes)

You can register with any email that doesn't already exist. Try:

1. **Valid Registration:**
   ```
   Name: Test Member
   Email: testmember@example.com
   Password: testpass123
   ```

2. **Test Email Already Exists:**
   ```
   Email: admin@legalchicks.vip (will fail - already exists)
   ```

3. **Test Password Requirements:**
   ```
   Password: short (will fail - less than 8 characters)
   ```

## Registration Logging

### Frontend Console Logs

**Successful Registration:**
```javascript
[AuthService] Registration successful for user: john@example.com
```

**Failed Registration:**
```javascript
[AuthService] Registration error: {
  email: "existing@example.com",
  status: 400,
  message: "An account with this email already exists.",
  errorType: "VALIDATION_ERROR",
  timestamp: "2024-01-15T10:30:45.123Z"
}
```

### Backend Console Logs

**Successful Registration:**
```javascript
[Auth] Registration successful: {
  email: "john@example.com",
  userId: "7",
  ip: "::1",
  timestamp: "2024-01-15T10:30:45.123Z"
}
```

**Failed Registration:**
```javascript
[Auth] Registration failed - email already exists: {
  email: "admin@legalchicks.vip",
  ip: "::1",
  timestamp: "2024-01-15T10:30:45.123Z",
  errorType: "EMAIL_EXISTS"
}
```

## New Member Defaults

When a new member registers, they are automatically assigned:

- **Role:** `member` (not admin)
- **Visibility:** `private` (profile not visible by default)
- **Status:** Active (can immediately use the portal)

## Next Steps After Registration

1. User is automatically logged in
2. JWT token is stored in localStorage
3. User is redirected to `/dashboard`
4. User can immediately:
   - View their dashboard
   - Update their profile
   - Access member features

## Future Enhancements

Potential improvements for member registration:

- [ ] Email verification workflow
- [ ] Password strength meter
- [ ] Additional member information (location, farm size, etc.)
- [ ] Admin approval process
- [ ] Welcome email notification
- [ ] Profile photo upload
- [ ] Member tier/level assignment
- [ ] Initial onboarding survey

## Troubleshooting

### Registration Not Working

1. **Check backend is running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check browser console for errors:**
   - Open DevTools (F12)
   - Look for `[AuthService]` log messages

3. **Check backend console:**
   - Look for `[Auth]` log messages
   - Verify API endpoint is accessible

4. **Verify API configuration:**
   - Check `src/config/api.config.ts`
   - Ensure backend URL matches your server

### Common Issues

**"Email already exists" error:**
- The email is already registered
- Try a different email address
- Or use the login page if you already have an account

**"Network error" or connection issues:**
- Verify backend server is running
- Check CORS configuration in backend `.env`
- Ensure API base URL is correct

**Form validation not showing:**
- Make sure you've touched/clicked the fields
- Check browser console for JavaScript errors

## API Endpoint Details

**URL:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Success Response (201):**
- Returns JWT token
- Returns user object (without password)
- Automatically logs user in

**Error Responses:**
- `400`: Missing fields or email exists
- `500`: Server error

