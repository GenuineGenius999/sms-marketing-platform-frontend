'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Campaign, Contact, ContactGroup } from '@/types'
import { Plus, Send, Calendar, Users, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function CampaignsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>(
    'campaigns',
    async () => {
      const response = await api.get('/campaigns/')
      return response.data
    }
  )

  const { data: contacts, isLoading: contactsLoading } = useQuery<Contact[]>(
    'contacts',
    async () => {
      const response = await api.get('/contacts/')
      return response.data
    }
  )

  const { data: groups, isLoading: groupsLoading } = useQuery<ContactGroup[]>(
    'contact-groups',
    async () => {
      const response = await api.get('/contacts/groups/')
      return response.data
    }
  )

  const createCampaignMutation = useMutation(
    async (campaignData: Partial<Campaign>) => {
      const response = await api.post('/campaigns/', campaignData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns')
        setShowCreateForm(false)
      }
    }
  )

  const sendCampaignMutation = useMutation(
    async ({ campaignId, contactIds }: { campaignId: string, contactIds: string[] }) => {
      const response = await api.post(`/campaigns/${campaignId}/send`, contactIds)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns')
        setSelectedContacts([])
      }
    }
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'sending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-blue-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'sending':
        return 'text-yellow-600 bg-yellow-100'
      case 'scheduled':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const campaignData = {
      name: formData.get('name') as string,
      message: formData.get('message') as string,
      scheduled_at: formData.get('scheduled_at') ? new Date(formData.get('scheduled_at') as string).toISOString() : undefined
    }
    createCampaignMutation.mutate(campaignData)
  }

  const handleSendCampaign = (campaignId: string) => {
    if (selectedContacts.length === 0) {
      alert('Please select contacts to send the campaign to')
      return
    }
    sendCampaignMutation.mutate({ campaignId, contactIds: selectedContacts })
  }

  if (campaignsLoading || contactsLoading || groupsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Create and manage your SMS campaigns</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>Set up your SMS campaign details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="scheduled_at">Schedule (Optional)</Label>
                  <Input 
                    id="scheduled_at" 
                    name="scheduled_at" 
                    type="datetime-local"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  rows={4}
                  placeholder="Enter your SMS message here..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createCampaignMutation.isLoading}>
                  {createCampaignMutation.isLoading ? 'Creating...' : 'Create Campaign'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contact Selection */}
      {selectedContacts.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selected Contacts ({selectedContacts.length})</CardTitle>
            <CardDescription>Choose contacts to send your campaign to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts?.filter(contact => selectedContacts.includes(contact.id.toString())).map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedContacts(prev => prev.filter(id => id !== contact.id.toString()))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(campaign.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{campaign.message}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Recipients:</span>
                  <span className="font-medium">{campaign.totalRecipients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivered:</span>
                  <span className="font-medium text-green-600">{campaign.deliveredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Failed:</span>
                  <span className="font-medium text-red-600">{campaign.failedCount}</span>
                </div>
                {campaign.scheduledAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Scheduled:</span>
                    <span className="font-medium">{formatDateTime(campaign.scheduledAt)}</span>
                  </div>
                )}
                {campaign.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sent:</span>
                    <span className="font-medium">{formatDateTime(campaign.sentAt)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                {campaign.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => handleSendCampaign(campaign.id.toString())}
                    disabled={sendCampaignMutation.isLoading}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Now
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  Select Contacts
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns?.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-500">Create your first SMS campaign to get started.</p>
        </div>
      )}
    </div>
  )
}
