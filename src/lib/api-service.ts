import { api } from './api'

// Types
export interface User {
    id: number
    email: string
    name: string
    role: string
    is_active: boolean
    balance: number
    company?: string
    phone?: string
    created_at: string
    updated_at?: string
}

export interface Contact {
    id: number
    name: string
    phone: string
    email: string
    group_id?: number
    is_active: boolean
    created_at: string
    updated_at?: string
}

export interface ContactGroup {
    id: number 
    name: string
    description: string
    contact_count: number
    created_at: string
    updated_at?: string
    user_id: number
}

export interface Campaign {
    id: number
    name: string
    message: string
    template_id?: number
    user_id: number
    status: string
    scheduled_at?: string
    sent_at?: string
    total_recipients: number
    delivered_count: number
    failed_count: number
    created_at: string
    updated_at?: string
}

export interface Message {
    id: number
    campaign_id?: number
    contact_id?: number
    recipient: string
    content: string
    status: string
    sent_at?: string
    delivered_at?: string
    error_message?: string
    message_id?: string
    is_incoming: boolean
    created_at: string
}

export interface SmsTemplate {
    id: number
    name: string
    content: string
    category: string
    is_approved: boolean
    user_id: number
    created_at: string
    updated_at?: string
}

export interface SenderId {
    id: number
    sender_id: string
    user_id: number
    is_approved: boolean
    created_at: string
    updated_at?: string
}

export interface Transaction {
    id: number
    user_id: number
    amount: number
    type: string
    description?: string
    status: string
    created_at: string
    updated_at?: string
}

export interface BillingStats {
    current_balance: number
    total_spent: number
    total_recharged: number
    pending_amount: number
    sms_cost_this_month: number
    transaction_count: number
}

export interface DashboardStats {
    total_campaigns: number
    active_campaigns: number
    total_contacts: number
    total_messages: number
    delivered_messages: number
    failed_messages: number
    success_rate: number
    revenue: number
}

export interface AutomationWorkflow {
    id: number
    name: string
    description?: string
    trigger_type: string
    trigger_config?: any
    action_type: string
    action_config?: any
    status: string
    is_active: boolean
    created_at: string
    updated_at?: string
}

export interface KeywordTrigger {
    id: number
    keyword: string
    response_message: string
    is_case_sensitive: boolean
    is_active: boolean
    created_at: string
}

export interface DripCampaign {
    id: number
    name: string
    description?: string
    is_active: boolean
    created_at: string
    updated_at?: string
}

// API Service Class
class ApiService {
    // Authentication
    async login(email: string, password: string) {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    }

    async register(userData: {
        email: string
        password: string
        name: string
        company?: string
        phone?: string
    }) {
        const response = await api.post('/auth/register', userData)
        return response.data
    }

    async getCurrentUser() {
        const response = await api.get('/auth/me')
        return response.data
    }

    // Dashboard
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await api.get('/dashboard/stats')
        return response.data
    }

    async getAdminDashboardStats() {
        const response = await api.get('/admin/dashboard/stats')
        return response.data
    }

    // Contacts
    async getContacts(skip = 0, limit = 100): Promise<Contact[]> {
        const response = await api.get(`/contacts/?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getContact(id: number): Promise<Contact> {
        const response = await api.get(`/contacts/${id}`)
        return response.data
    }

    async createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/contacts/', contact)
        return response.data
    }

    async updateContact(id: number, contact: Partial<Contact>) {
        const response = await api.put(`/contacts/${id}`, contact)
        return response.data
    }

    async deleteContact(id: number) {
        const response = await api.delete(`/contacts/${id}`)
        return response.data
    }

    async importContacts(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        const response = await api.post('/contacts/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    }

    // Contact Groups
    async getContactGroups(): Promise<ContactGroup[]> {
        const response = await api.get('/contacts/groups/')
        return response.data
    }

    async createContactGroup(group: Omit<ContactGroup, 'id' | 'contact_count' | 'created_at' | 'updated_at' | 'user_id'>) {
        const response = await api.post('/contacts/groups/', group)
        return response.data
    }

    async updateContactGroup(id: number, group: Partial<ContactGroup>) {
        const response = await api.put(`/contacts/groups/${id}`, group)
        return response.data
    }

    async deleteContactGroup(id: number) {
        const response = await api.delete(`/contacts/groups/${id}`)
        return response.data
    }

    // Campaigns
    async getCampaigns(skip = 0, limit = 100): Promise<Campaign[]> {
        const response = await api.get(`/campaigns/?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getCampaign(id: number): Promise<Campaign> {
        const response = await api.get(`/campaigns/${id}`)
        return response.data
    }

    async createCampaign(campaign: Omit<Campaign, 'id' | 'user_id' | 'delivered_count' | 'failed_count' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/campaigns/', campaign)
        return response.data
    }

    async updateCampaign(id: number, campaign: Partial<Campaign>) {
        const response = await api.put(`/campaigns/${id}`, campaign)
        return response.data
    }

    async deleteCampaign(id: number) {
        const response = await api.delete(`/campaigns/${id}`)
        return response.data
    }

    async startCampaign(id: number) {
        const response = await api.post(`/campaigns/${id}/start`)
        return response.data
    }

    async pauseCampaign(id: number) {
        const response = await api.post(`/campaigns/${id}/pause`)
        return response.data
    }

    // Messages
    async getMessages(skip = 0, limit = 100): Promise<Message[]> {
        const response = await api.get(`/messages/?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getMessage(id: number): Promise<Message> {
        const response = await api.get(`/messages/${id}`)
        return response.data
    }

    async sendQuickSms(phoneNumbers: string[], message: string) {
        const response = await api.post('/messages/send-quick', {
            phone_numbers: phoneNumbers,
            message: message
        })
        return response.data
    }

    // Templates
    async getTemplates(skip = 0, limit = 100): Promise<SmsTemplate[]> {
        const response = await api.get(`/templates/?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getTemplate(id: number): Promise<SmsTemplate> {
        const response = await api.get(`/templates/${id}`)
        return response.data
    }

    async createTemplate(template: Omit<SmsTemplate, 'id' | 'is_approved' | 'user_id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/templates/', template)
        return response.data
    }

    async updateTemplate(id: number, template: Partial<SmsTemplate>) {
        const response = await api.put(`/templates/${id}`, template)
        return response.data
    }

    async deleteTemplate(id: number) {
        const response = await api.delete(`/templates/${id}`)
        return response.data
    }

    // Sender IDs
    async getSenderIds(): Promise<SenderId[]> {
        const response = await api.get('/sender-ids/')
        return response.data
    }

    async createSenderId(senderId: Omit<SenderId, 'id' | 'is_approved' | 'user_id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/sender-ids/', senderId)
        return response.data
    }

    async updateSenderId(id: number, senderId: Partial<SenderId>) {
        const response = await api.put(`/sender-ids/${id}`, senderId)
        return response.data
    }

    async deleteSenderId(id: number) {
        const response = await api.delete(`/sender-ids/${id}`)
        return response.data
    }

    // Billing
    async getBillingStats(): Promise<BillingStats> {
        const response = await api.get('/billing/stats')
        return response.data
    }

    async getTransactions(skip = 0, limit = 100): Promise<Transaction[]> {
        const response = await api.get(`/billing/transactions?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/billing/transactions', transaction)
        return response.data
    }

    async getPaymentMethods() {
        const response = await api.get('/billing/payment-methods')
        return response.data
    }

    async createPaymentMethod(paymentMethod: any) {
        const response = await api.post('/billing/payment-methods', paymentMethod)
        return response.data
    }

    // Reports
    async getReports(skip = 0, limit = 100) {
        const response = await api.get(`/reports/?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getAnalytics() {
        const response = await api.get('/reports/analytics')
        return response.data
    }

    async createReport(report: any) {
        const response = await api.post('/reports/', report)
        return response.data
    }

    // Automation
    async getAutomationWorkflows(): Promise<AutomationWorkflow[]> {
        const response = await api.get('/automation/workflows')
        return response.data
    }

    async createAutomationWorkflow(workflow: Omit<AutomationWorkflow, 'id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/automation/workflows', workflow)
        return response.data
    }

    async updateAutomationWorkflow(id: number, workflow: Partial<AutomationWorkflow>) {
        const response = await api.put(`/automation/workflows/${id}`, workflow)
        return response.data
    }

    async deleteAutomationWorkflow(id: number) {
        const response = await api.delete(`/automation/workflows/${id}`)
        return response.data
    }

    async getKeywordTriggers(): Promise<KeywordTrigger[]> {
        const response = await api.get('/automation/keyword-triggers')
        return response.data
    }

    async createKeywordTrigger(trigger: Omit<KeywordTrigger, 'id' | 'created_at'>) {
        const response = await api.post('/automation/keyword-triggers', trigger)
        return response.data
    }

    async updateKeywordTrigger(id: number, trigger: Partial<KeywordTrigger>) {
        const response = await api.put(`/automation/keyword-triggers/${id}`, trigger)
        return response.data
    }

    async deleteKeywordTrigger(id: number) {
        const response = await api.delete(`/automation/keyword-triggers/${id}`)
        return response.data
    }

    async getDripCampaigns(): Promise<DripCampaign[]> {
        const response = await api.get('/automation/drip-campaigns')
        return response.data
    }

    async createDripCampaign(campaign: Omit<DripCampaign, 'id' | 'created_at' | 'updated_at'>) {
        const response = await api.post('/automation/drip-campaigns', campaign)
        return response.data
    }

    async updateDripCampaign(id: number, campaign: Partial<DripCampaign>) {
        const response = await api.put(`/automation/drip-campaigns/${id}`, campaign)
        return response.data
    }

    async deleteDripCampaign(id: number) {
        const response = await api.delete(`/automation/drip-campaigns/${id}`)
        return response.data
    }

    // Two-Way SMS
    async getConversations(contactId?: number) {
        const response = await api.get(`/two-way-sms/conversations${contactId ? `?contact_id=${contactId}` : ''}`)
        return response.data
    }

    async sendReply(contactId: number, message: string) {
        const response = await api.post('/two-way-sms/send-reply', {
            contact_id: contactId,
            message: message
        })
        return response.data
    }

    async processOptOut(contactId: number) {
        const response = await api.post('/two-way-sms/opt-out', {
            contact_id: contactId
        })
        return response.data
    }

    // Admin
    async getAdminUsers(skip = 0, limit = 100) {
        const response = await api.get(`/admin/users?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getAdminUser(id: number) {
        const response = await api.get(`/admin/users/${id}`)
        return response.data
    }

    async updateAdminUser(id: number, user: Partial<User>) {
        const response = await api.put(`/admin/users/${id}`, user)
        return response.data
    }

    async deleteAdminUser(id: number) {
        const response = await api.delete(`/admin/users/${id}`)
        return response.data
    }

    async getAdminCampaigns(skip = 0, limit = 100) {
        const response = await api.get(`/admin/campaigns?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async getAdminSenderIds() {
        const response = await api.get('/admin/sender-ids')
        return response.data
    }

    async getAdminTemplates(skip = 0, limit = 100) {
        const response = await api.get(`/admin/templates?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async approveTemplate(id: number) {
        const response = await api.put(`/admin/templates/${id}/approve`)
        return response.data
    }

    async rejectTemplate(id: number) {
        const response = await api.put(`/admin/templates/${id}/reject`)
        return response.data
    }

    async approveSenderId(id: number) {
        const response = await api.put(`/admin/sender-ids/${id}/approve`)
        return response.data
    }

    async rejectSenderId(id: number) {
        const response = await api.put(`/admin/sender-ids/${id}/reject`)
        return response.data
    }

    async getAdminVendors() {
        const response = await api.get('/admin/vendors')
        return response.data
    }

    async getAdminReports() {
        const response = await api.get('/admin/reports')
        return response.data
    }

    // A/B Testing Methods
    async getABTests(skip = 0, limit = 100) {
        const response = await api.get(`/ab-testing/campaigns?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async createABTest(testData: any) {
        const response = await api.post('/ab-testing/campaigns', testData)
        return response.data
    }

    async startABTest(testId: number) {
        const response = await api.post(`/ab-testing/campaigns/${testId}/start`)
        return response.data
    }

    async analyzeABTest(testId: number) {
        const response = await api.post(`/ab-testing/campaigns/${testId}/analyze`)
        return response.data
    }

    async getABTestStats() {
        const response = await api.get('/ab-testing/stats')
        return response.data
    }

    // Survey Methods
    async getSurveys(skip = 0, limit = 100) {
        const response = await api.get(`/surveys/surveys?skip=${skip}&limit=${limit}`)
        return response.data
    }

    async createSurvey(surveyData: any) {
        const response = await api.post('/surveys/surveys', surveyData)
        return response.data
    }

    async sendSurvey(surveyId: number) {
        const response = await api.post(`/surveys/surveys/${surveyId}/send`)
        return response.data
    }

    async getSurveyStats() {
        const response = await api.get('/surveys/stats')
        return response.data
    }

    async getSurveyAnalytics(surveyId: number) {
        const response = await api.get(`/surveys/surveys/${surveyId}/analytics`)
        return response.data
    }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
