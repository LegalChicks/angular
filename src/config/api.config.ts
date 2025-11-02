/**
 * API Configuration
 * 
 * Set the backend API base URL here.
 * In production, this should come from environment variables.
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:3001/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      verify: '/auth/verify'
    },
    users: {
      members: '/users/members',
      profile: (id: string) => `/users/profile/${id}`
    },
    business: {
      invoices: '/business/invoices',
      expenses: '/business/expenses',
      profitability: '/business/profitability'
    },
    analytics: {
      data: '/analytics'
    }
  }
};

