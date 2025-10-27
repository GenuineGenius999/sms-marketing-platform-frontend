import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
})

// Query Keys
export const queryKeys = {
  // Auth
  currentUser: ['auth', 'me'] as const,
  
  // Dashboard
  dashboardStats: ['dashboard', 'stats'] as const,
  adminDashboardStats: ['admin', 'dashboard', 'stats'] as const,
  
  // Contacts
  contacts: (skip?: number, limit?: number) => ['contacts', { skip, limit }] as const,
  contact: (id: number) => ['contacts', id] as const,
  contactGroups: ['contacts', 'groups'] as const,
  contactGroup: (id: number) => ['contacts', 'groups', id] as const,
  
  // Campaigns
  campaigns: (skip?: number, limit?: number) => ['campaigns', { skip, limit }] as const,
  campaign: (id: number) => ['campaigns', id] as const,
  adminCampaigns: (skip?: number, limit?: number) => ['admin', 'campaigns', { skip, limit }] as const,
  
  // Messages
  messages: (skip?: number, limit?: number) => ['messages', { skip, limit }] as const,
  message: (id: number) => ['messages', id] as const,
  conversations: (contactId?: number) => ['conversations', { contactId }] as const,
  
  // Templates
  templates: (skip?: number, limit?: number) => ['templates', { skip, limit }] as const,
  template: (id: number) => ['templates', id] as const,
  adminTemplates: (skip?: number, limit?: number) => ['admin', 'templates', { skip, limit }] as const,
  
  // Sender IDs
  senderIds: ['sender-ids'] as const,
  senderId: (id: number) => ['sender-ids', id] as const,
  adminSenderIds: ['admin', 'sender-ids'] as const,
  
  // Billing
  billingStats: ['billing', 'stats'] as const,
  transactions: (skip?: number, limit?: number) => ['billing', 'transactions', { skip, limit }] as const,
  paymentMethods: ['billing', 'payment-methods'] as const,
  
  // Reports
  reports: (skip?: number, limit?: number) => ['reports', { skip, limit }] as const,
  analytics: ['reports', 'analytics'] as const,
  adminReports: ['admin', 'reports'] as const,
  
  // Automation
  automationWorkflows: ['automation', 'workflows'] as const,
  automationWorkflow: (id: number) => ['automation', 'workflows', id] as const,
  keywordTriggers: ['automation', 'keyword-triggers'] as const,
  keywordTrigger: (id: number) => ['automation', 'keyword-triggers', id] as const,
  dripCampaigns: ['automation', 'drip-campaigns'] as const,
  dripCampaign: (id: number) => ['automation', 'drip-campaigns', id] as const,
  
  // Admin
  adminUsers: (skip?: number, limit?: number) => ['admin', 'users', { skip, limit }] as const,
  adminUser: (id: number) => ['admin', 'users', id] as const,
  adminVendors: ['admin', 'vendors'] as const,
}
