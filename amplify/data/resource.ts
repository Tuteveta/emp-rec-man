import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Employee: a.model({
    employeeId: a.string().required(),
    fullName: a.string().required(),
    preferredName: a.string(),
    email: a.email().required(),
    phone: a.string(),
    dateOfBirth: a.date(),
    gender: a.string(),
    maritalStatus: a.string(),
    nationality: a.string(),
    nationalId: a.string(),
    residentialAddress: a.string(),
    emergencyContactName: a.string(),
    emergencyContactPhone: a.string(),
    
    // Employment Details
    department: a.string().required(),
    position: a.string().required(),
    employmentType: a.enum(['PERMANENT', 'CONTRACT', 'CASUAL', 'INTERN']),
    status: a.enum(['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'SEPARATED']),
    hireDate: a.date().required(),
    contractStartDate: a.date(),
    contractEndDate: a.date(),
    supervisorId: a.string(),
    workLocation: a.string(),
    
    // Payroll & Compensation
    salary: a.float(),
    payFrequency: a.enum(['WEEKLY', 'FORTNIGHTLY', 'MONTHLY']),
    bankAccountNumber: a.string(),
    taxFileNumber: a.string(),
    
    // Leave & Attendance
    annualLeaveBalance: a.integer().default(20),
    sickLeaveBalance: a.integer().default(10),
    
    // Performance
    lastReviewDate: a.date(),
    performanceRating: a.string(),
    
    // Audit fields
    createdBy: a.string(),
    updatedBy: a.string(),
  })
  .authorization(allow => [
    allow.authenticated(),
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});