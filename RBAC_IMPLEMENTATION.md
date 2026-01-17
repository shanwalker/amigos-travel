# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the comprehensive role-based access control system implemented for the TravelAmigo application. The system ensures strict separation between admin and user dashboards with automatic role-based redirection.

## Key Features

### 1. **Strict Role Separation**
- **Admin users** can ONLY access `/admin/*` routes
- **Regular users** can ONLY access `/dashboard/*` routes
- Attempting to access the wrong dashboard automatically redirects to the correct one

### 2. **Automatic Redirection Logic**

#### Login Behavior
- **Admin Login** (`/admin/login`):
  - Only accepts users with `admin` role in `user_roles` table
  - Non-admin users are logged out and shown error message
  - Successful admin login → redirects to `/admin`

- **User Login** (`/login`):
  - Checks user role after authentication
  - Admin users → redirects to `/admin`
  - Regular users → redirects to `/dashboard`

#### Protected Route Behavior
- **Admin accessing `/dashboard/*`**: Automatically redirected to `/admin`
- **User accessing `/admin/*`**: Automatically redirected to `/dashboard`
- **Unauthenticated accessing `/admin/*`**: Redirected to `/admin/login`
- **Unauthenticated accessing `/dashboard/*`**: Redirected to `/login`

### 3. **Role Detection**
Roles are stored in the `user_roles` table with the following structure:
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Implementation Details

### Files Modified

1. **`src/components/auth/ProtectedRoute.tsx`**
   - Enhanced with role-based redirection logic
   - Detects admin vs user routes
   - Automatically redirects based on user role

2. **`src/pages/auth/Login.tsx`**
   - Added role checking after login
   - Redirects to appropriate dashboard based on role
   - Prevents already-logged-in users from accessing login page

3. **`src/pages/auth/AdminLogin.tsx`**
   - Validates admin role before allowing access
   - Signs out non-admin users who attempt to login
   - Shows clear error message for unauthorized access

4. **`src/contexts/AuthContext.tsx`**
   - Fetches user roles from database
   - Provides `isAdmin` boolean for easy role checking
   - Maintains role state throughout session

## User Flows

### Admin User Flow
```
1. Navigate to /admin/login
2. Enter admin credentials
3. System validates admin role in database
4. Redirect to /admin (Admin Dashboard)
5. All navigation stays within /admin/* routes
6. Attempting to access /dashboard/* → Auto-redirect to /admin
```

### Regular User Flow
```
1. Navigate to /login
2. Enter user credentials
3. System checks role (not admin)
4. Redirect to /dashboard (User Dashboard)
5. All navigation stays within /dashboard/* routes
6. Attempting to access /admin/* → Auto-redirect to /dashboard
```

### Mixed Scenario
```
Scenario: Admin user tries to access /dashboard
1. Admin is logged in
2. Navigates to /dashboard
3. ProtectedRoute detects: user is admin + route is /dashboard/*
4. Automatic redirect to /admin
5. Admin stays in admin dashboard

Scenario: Regular user tries to access /admin
1. User is logged in
2. Navigates to /admin
3. ProtectedRoute detects: user is NOT admin + route is /admin/*
4. Automatic redirect to /dashboard
5. User stays in user dashboard
```

## Database Setup

### Creating an Admin User

To create an admin user, you need to insert a record in the `user_roles` table:

```sql
-- First, create a user through the signup process or Supabase Auth UI
-- Then, add admin role:

INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin');
```

### Checking User Roles

```sql
-- Get all admin users
SELECT u.email, ur.role
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- Get roles for specific user
SELECT role
FROM user_roles
WHERE user_id = 'USER_UUID_HERE';
```

## Testing Checklist

- [ ] Admin can login via `/admin/login`
- [ ] Admin is redirected to `/admin` after login
- [ ] Admin accessing `/dashboard` is redirected to `/admin`
- [ ] Regular user can login via `/login`
- [ ] Regular user is redirected to `/dashboard` after login
- [ ] Regular user accessing `/admin` is redirected to `/dashboard`
- [ ] Non-admin user cannot login via `/admin/login`
- [ ] Unauthenticated user accessing `/admin` is redirected to `/admin/login`
- [ ] Unauthenticated user accessing `/dashboard` is redirected to `/login`
- [ ] Already logged-in admin accessing `/login` is redirected to `/admin`
- [ ] Already logged-in user accessing `/admin/login` is redirected to `/dashboard`

## Security Considerations

1. **Database-Level Role Validation**: Roles are validated against the database, not just client-side state
2. **Automatic Logout**: Non-admin users attempting admin login are automatically logged out
3. **No Route Leakage**: Users cannot access routes meant for other roles, even temporarily
4. **Session Persistence**: Role information is maintained throughout the session
5. **Secure Redirects**: All redirects use `replace: true` to prevent back-button exploitation

## Future Enhancements

1. **Moderator Role**: Add support for moderator role with limited admin access
2. **Role Permissions**: Implement granular permissions within roles
3. **Multi-Role Support**: Allow users to have multiple roles
4. **Role-Based UI**: Show/hide UI elements based on user role
5. **Audit Logging**: Track role-based access attempts

## Troubleshooting

### Issue: User stuck in redirect loop
**Solution**: Check that user has a valid role in `user_roles` table. Users without roles may cause issues.

### Issue: Admin can't access admin panel
**Solution**: Verify the user has 'admin' role in database:
```sql
SELECT * FROM user_roles WHERE user_id = 'USER_UUID';
```

### Issue: Role not updating after database change
**Solution**: User needs to log out and log back in, or call `refreshRoles()` from AuthContext.

## Support

For issues or questions about the RBAC implementation, please refer to:
- AuthContext documentation
- ProtectedRoute component
- Supabase Auth documentation
