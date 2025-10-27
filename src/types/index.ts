export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'client'
  isActive: boolean
  createdAt: string
  updatedAt: string
  balance?: number
  company?: string
  phone?: string
}

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  groupId?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ContactGroup {
  id: string
  name: string
  description?: string
  userId: string
  contactCount: number
  createdAt: string
  updatedAt: string
}

export interface SmsTemplate {
  id: string
  name: string
  content: string
  userId: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  name: string
  message: string
  templateId?: string
  userId: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  scheduledAt?: string
  sentAt?: string
  totalRecipients: number
  deliveredCount: number
  failedCount: number
  createdAt: string
  updatedAt: string
}

export interface SenderId {
  id: string
  senderId: string
  userId: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  campaignId: string
  recipient: string
  content: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sentAt?: string
  deliveredAt?: string
  errorMessage?: string
  createdAt: string
}

export interface DashboardStats {
  totalCampaigns: number
  totalMessages: number
  deliveredMessages: number
  failedMessages: number
  pendingMessages: number
  totalContacts: number
  totalGroups: number
  balance: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
