import { useQuery, useMutation, useQueryClient } from 'react-query'
import { apiService } from '@/lib/api-service'
import { queryKeys } from '@/lib/react-query'

// Auth hooks
export const useCurrentUser = () => {
  return useQuery(queryKeys.currentUser, apiService.getCurrentUser, {
    retry: false,
    staleTime: Infinity,
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation(({ email, password }: { email: string; password: string }) => 
    apiService.login(email, password), {
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      queryClient.invalidateQueries(queryKeys.currentUser)
      alert('Login successful!')
    },
    onError: (error: any) => {
      alert(error.message || 'Login failed')
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.register, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      queryClient.invalidateQueries(queryKeys.currentUser)
      alert('Registration successful!')
    },
    onError: (error: any) => {
      alert(error.message || 'Registration failed')
    },
  })
}

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery(queryKeys.dashboardStats, apiService.getDashboardStats)
}

export const useAdminDashboardStats = () => {
  return useQuery(queryKeys.adminDashboardStats, apiService.getAdminDashboardStats)
}

// Contact hooks
export const useContacts = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.contacts(skip, limit), () => apiService.getContacts(skip, limit))
}

export const useContact = (id: number) => {
  return useQuery(queryKeys.contact(id), () => apiService.getContact(id), {
    enabled: !!id,
  })
}

export const useCreateContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createContact, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.contacts())
      alert('Contact created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create contact')
    },
  })
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateContact(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(queryKeys.contacts())
        queryClient.invalidateQueries(queryKeys.contact(id))
        alert('Contact updated successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to update contact')
      },
    }
  )
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.deleteContact, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.contacts())
      alert('Contact deleted successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete contact')
    },
  })
}

export const useImportContacts = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.importContacts, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.contacts())
      alert('Contacts imported successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to import contacts')
    },
  })
}

// Contact Group hooks
export const useContactGroups = () => {
  return useQuery(queryKeys.contactGroups, apiService.getContactGroups)
}

export const useCreateContactGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createContactGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.contactGroups)
      alert('Contact group created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create contact group')
    },
  })
}

export const useUpdateContactGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateContactGroup(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(queryKeys.contactGroups)
        queryClient.invalidateQueries(queryKeys.contactGroup(id))
        alert('Contact group updated successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to update contact group')
      },
    }
  )
}

export const useDeleteContactGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.deleteContactGroup, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.contactGroups)
      alert('Contact group deleted successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete contact group')
    },
  })
}

// Campaign hooks
export const useCampaigns = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.campaigns(skip, limit), () => apiService.getCampaigns(skip, limit))
}

export const useCampaign = (id: number) => {
  return useQuery(queryKeys.campaign(id), () => apiService.getCampaign(id), {
    enabled: !!id,
  })
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.campaigns())
      alert('Campaign created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create campaign')
    },
  })
}

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateCampaign(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(queryKeys.campaigns())
        queryClient.invalidateQueries(queryKeys.campaign(id))
        alert('Campaign updated successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to update campaign')
      },
    }
  )
}

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.deleteCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.campaigns())
      alert('Campaign deleted successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete campaign')
    },
  })
}

export const useStartCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.startCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.campaigns())
      alert('Campaign started successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to start campaign')
    },
  })
}

// Message hooks
export const useMessages = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.messages(skip, limit), () => apiService.getMessages(skip, limit))
}

export const useSendQuickSms = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ phoneNumbers, message }: { phoneNumbers: string[]; message: string }) =>
      apiService.sendQuickSms(phoneNumbers, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.messages())
        queryClient.invalidateQueries(queryKeys.campaigns())
        alert('SMS sent successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to send SMS')
      },
    }
  )
}

// Template hooks
export const useTemplates = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.templates(skip, limit), () => apiService.getTemplates(skip, limit))
}

export const useCreateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.templates())
      alert('Template created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create template')
    },
  })
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateTemplate(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.templates())
        alert('Template updated successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to update template')
      },
    }
  )
}

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.deleteTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.templates())
      alert('Template deleted successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete template')
    },
  })
}

// Sender ID hooks
export const useSenderIds = () => {
  return useQuery(queryKeys.senderIds, apiService.getSenderIds)
}

export const useCreateSenderId = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createSenderId, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.senderIds)
      alert('Sender ID created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create sender ID')
    },
  })
}

// Billing hooks
export const useBillingStats = () => {
  return useQuery(queryKeys.billingStats, apiService.getBillingStats)
}

export const useTransactions = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.transactions(skip, limit), () => apiService.getTransactions(skip, limit))
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createTransaction, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.billingStats)
      queryClient.invalidateQueries(queryKeys.transactions())
      alert('Transaction created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create transaction')
    },
  })
}

// Reports hooks
export const useAnalytics = () => {
  return useQuery(queryKeys.analytics, apiService.getAnalytics)
}

// Automation hooks
export const useAutomationWorkflows = () => {
  return useQuery(queryKeys.automationWorkflows, apiService.getAutomationWorkflows)
}

export const useCreateAutomationWorkflow = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createAutomationWorkflow, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.automationWorkflows)
      alert('Automation workflow created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create automation workflow')
    },
  })
}

export const useUpdateAutomationWorkflow = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateAutomationWorkflow(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.automationWorkflows)
        alert('Automation workflow updated successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to update automation workflow')
      },
    }
  )
}

export const useDeleteAutomationWorkflow = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.deleteAutomationWorkflow, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.automationWorkflows)
      alert('Automation workflow deleted successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to delete automation workflow')
    },
  })
}

export const useKeywordTriggers = () => {
  return useQuery(queryKeys.keywordTriggers, apiService.getKeywordTriggers)
}

export const useCreateKeywordTrigger = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createKeywordTrigger, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.keywordTriggers)
      alert('Keyword trigger created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create keyword trigger')
    },
  })
}

export const useDripCampaigns = () => {
  return useQuery(queryKeys.dripCampaigns, apiService.getDripCampaigns)
}

export const useCreateDripCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.createDripCampaign, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.dripCampaigns)
      alert('Drip campaign created successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create drip campaign')
    },
  })
}

// Two-way SMS hooks
export const useConversations = (contactId?: number) => {
  return useQuery(queryKeys.conversations(contactId), () => apiService.getConversations(contactId))
}

export const useSendReply = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ contactId, message }: { contactId: number; message: string }) =>
      apiService.sendReply(contactId, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.conversations())
        alert('Reply sent successfully!')
      },
      onError: (error: any) => {
        alert(error.message || 'Failed to send reply')
      },
    }
  )
}

// Admin hooks
export const useAdminUsers = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.adminUsers(skip, limit), () => apiService.getAdminUsers(skip, limit))
}

export const useAdminCampaigns = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.adminCampaigns(skip, limit), () => apiService.getAdminCampaigns(skip, limit))
}

export const useAdminTemplates = (skip = 0, limit = 100) => {
  return useQuery(queryKeys.adminTemplates(skip, limit), () => apiService.getAdminTemplates(skip, limit))
}

export const useApproveTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.approveTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.adminTemplates())
      alert('Template approved successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to approve template')
    },
  })
}

export const useRejectTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.rejectTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.adminTemplates())
      alert('Template rejected successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to reject template')
    },
  })
}

export const useAdminSenderIds = () => {
  return useQuery(queryKeys.adminSenderIds, apiService.getAdminSenderIds)
}

export const useApproveSenderId = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.approveSenderId, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.adminSenderIds)
      alert('Sender ID approved successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to approve sender ID')
    },
  })
}

export const useRejectSenderId = () => {
  const queryClient = useQueryClient()
  
  return useMutation(apiService.rejectSenderId, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.adminSenderIds)
      alert('Sender ID rejected successfully!')
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to reject sender ID')
    },
  })
}

export const useAdminVendors = () => {
  return useQuery(queryKeys.adminVendors, apiService.getAdminVendors)
}

export const useAdminReports = () => {
  return useQuery(queryKeys.adminReports, apiService.getAdminReports)
}
