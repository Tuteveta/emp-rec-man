import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['SUPER_ADMIN', 'HR_ADMIN', 'HR_OFFICER', 'EMPLOYEE'],
});