## User Roles

- **SUPER_ADMIN**: Complete system access including:
  - All HR Admin capabilities
  - User role management
  - System configuration
  - Audit log access
  - Delete any records
  - Modify system settings

- **HR_ADMIN**: Full employee management access
  - Create, read, update, delete employee records
  - Approve leave requests
  - Conduct performance reviews
  - View reports and analytics

- **HR_OFFICER**: Standard HR operations
  - Create, read, update employee records (no delete)
  - View leave requests
  - Input performance data

- **EMPLOYEE**: Self-service portal
  - View own profile
  - Submit leave requests
  - View own performance reviews

## Initial Setup - Create Super Admin

After deployment:

1. Go to **AWS Cognito Console**
2. Find your User Pool
3. Create groups in this order:
   - `SUPER_ADMIN`
   - `HR_ADMIN`
   - `HR_OFFICER`
   - `EMPLOYEE`

4. Create your first user:
   - Email: your-admin@dict.gov.pg
   - Temporary password (will be changed on first login)

5. Add user to `SUPER_ADMIN` group:
   - Go to Users → Select user → Add to group → `SUPER_ADMIN`

6. Login with admin account and create other users through the system

## Security Best Practices

- **SUPER_ADMIN**: Limit to 2-3 trusted administrators only
- **HR_ADMIN**: Department heads and senior HR staff
- **HR_OFFICER**: Regular HR personnel
- **EMPLOYEE**: All other staff members