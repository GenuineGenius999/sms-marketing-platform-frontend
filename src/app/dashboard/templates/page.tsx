'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { SmsTemplate } from '@/types'
import { Plus, Edit, Trash2, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function TemplatesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null)
  const [newTemplateContent, setNewTemplateContent] = useState('')
  const queryClient = useQueryClient()

  const { data: templates, isLoading } = useQuery<SmsTemplate[]>(
    'templates',
    async () => {
      const response = await api.get('/templates/')
      return response.data
    }
  )

  const addTemplateMutation = useMutation(
    async (templateData: Partial<SmsTemplate>) => {
      const response = await api.post('/templates/', templateData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('templates')
        setShowAddForm(false)
        setNewTemplateContent('')
      }
    }
  )

  const updateTemplateMutation = useMutation(
    async ({ id, data }: { id: string, data: Partial<SmsTemplate> }) => {
      const response = await api.put(`/templates/${id}`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('templates')
        setEditingTemplate(null)
      }
    }
  )

  const deleteTemplateMutation = useMutation(
    async (templateId: string) => {
      await api.delete(`/templates/${templateId}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('templates')
      }
    }
  )

  const handleAddTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const templateData = {
      name: formData.get('name') as string,
      content: formData.get('content') as string
    }
    addTemplateMutation.mutate(templateData)
    setNewTemplateContent('') // Reset form content
  }

  const handleUpdateTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTemplate) return
    
    const formData = new FormData(e.currentTarget)
    const templateData = {
      name: formData.get('name') as string,
      content: formData.get('content') as string
    }
    updateTemplateMutation.mutate({ id: editingTemplate.id, data: templateData })
  }

  const getApprovalIcon = (isApproved: boolean) => {
    if (isApproved) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    return <Clock className="h-4 w-4 text-yellow-600" />
  }

  const getApprovalColor = (isApproved: boolean) => {
    if (isApproved) {
      return 'text-green-600 bg-green-100'
    }
    return 'text-yellow-600 bg-yellow-100'
  }

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Create and manage your SMS message templates</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      {/* Add Template Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Template</CardTitle>
            <CardDescription>Create a reusable SMS message template</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTemplate} className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="content">Message Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  required 
                  rows={4}
                  placeholder="Enter your template message here..."
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Character count: {newTemplateContent.length}/160
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addTemplateMutation.isLoading}>
                  {addTemplateMutation.isLoading ? 'Creating...' : 'Create Template'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddForm(false)
                  setNewTemplateContent('')
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Template Form */}
      {editingTemplate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Template</CardTitle>
            <CardDescription>Update your template details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateTemplate} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Template Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  defaultValue={editingTemplate.name}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Message Content</Label>
                <Textarea 
                  id="edit-content" 
                  name="content" 
                  defaultValue={editingTemplate.content}
                  required 
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Character count: {editingTemplate.content.length}/160
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={updateTemplateMutation.isLoading}>
                  {updateTemplateMutation.isLoading ? 'Updating...' : 'Update Template'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {getApprovalIcon(template.isApproved)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalColor(template.isApproved)}`}>
                      {template.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteTemplateMutation.mutate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-4">{template.content}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Characters:</span>
                  <span className="font-medium">{template.content.length}/160</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SMS Count:</span>
                  <span className="font-medium">{Math.ceil(template.content.length / 160)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full">
                  Use in Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates?.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
          <p className="text-gray-500">Create your first template to get started.</p>
        </div>
      )}
    </div>
  )
}
