'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { Plus, Edit, Trash2, Play, Pause, Settings, MessageSquare, Clock, Users } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface AutomationWorkflow {
  id: number
  name: string
  description: string
  trigger_type: string
  action_type: string
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface KeywordTrigger {
  id: number
  keyword: string
  response_message: string
  is_case_sensitive: boolean
  is_active: boolean
  created_at: string
}

interface DripCampaign {
  id: number
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [keywordTriggers, setKeywordTriggers] = useState<KeywordTrigger[]>([])
  const [dripCampaigns, setDripCampaigns] = useState<DripCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false)
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false)
  const [isDripDialogOpen, setIsDripDialogOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<AutomationWorkflow | null>(null)
  const [editingKeyword, setEditingKeyword] = useState<KeywordTrigger | null>(null)
  const [editingDrip, setEditingDrip] = useState<DripCampaign | null>(null)

  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    description: '',
    trigger_type: 'keyword',
    action_type: 'send_sms',
    trigger_config: {},
    action_config: {}
  })

  const [keywordForm, setKeywordForm] = useState({
    keyword: '',
    response_message: '',
    is_case_sensitive: false
  })

  const [dripForm, setDripForm] = useState({
    name: '',
    description: '',
    steps: []
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [workflowsRes, keywordsRes, dripsRes] = await Promise.all([
        api.get('/automation/workflows'),
        api.get('/automation/keyword-triggers'),
        api.get('/automation/drip-campaigns')
      ])
      
      setWorkflows(workflowsRes.data)
      setKeywordTriggers(keywordsRes.data)
      setDripCampaigns(dripsRes.data)
    } catch (error) {
      console.error('Error fetching automation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingWorkflow) {
        await api.put(`/automation/workflows/${editingWorkflow.id}`, workflowForm)
      } else {
        await api.post('/automation/workflows', workflowForm)
      }
      
      setIsWorkflowDialogOpen(false)
      setEditingWorkflow(null)
      setWorkflowForm({
        name: '',
        description: '',
        trigger_type: 'keyword',
        action_type: 'send_sms',
        trigger_config: {},
        action_config: {}
      })
      fetchData()
    } catch (error) {
      console.error('Error saving workflow:', error)
    }
  }

  const handleKeywordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingKeyword) {
        await api.put(`/automation/keyword-triggers/${editingKeyword.id}`, keywordForm)
      } else {
        await api.post('/automation/keyword-triggers', keywordForm)
      }
      
      setIsKeywordDialogOpen(false)
      setEditingKeyword(null)
      setKeywordForm({
        keyword: '',
        response_message: '',
        is_case_sensitive: false
      })
      fetchData()
    } catch (error) {
      console.error('Error saving keyword trigger:', error)
    }
  }

  const handleDripSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingDrip) {
        await api.put(`/automation/drip-campaigns/${editingDrip.id}`, dripForm)
      } else {
        await api.post('/automation/drip-campaigns', dripForm)
      }
      
      setIsDripDialogOpen(false)
      setEditingDrip(null)
      setDripForm({
        name: '',
        description: '',
        steps: []
      })
      fetchData()
    } catch (error) {
      console.error('Error saving drip campaign:', error)
    }
  }

  const handleDelete = async (type: string, id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/automation/${type}/${id}`)
        fetchData()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const toggleActive = async (type: string, id: number, isActive: boolean) => {
    try {
      await api.put(`/automation/${type}/${id}`, { is_active: !isActive })
      fetchData()
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600">Automate your SMS marketing with workflows, triggers, and drip campaigns</p>
        </div>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Triggers</TabsTrigger>
          <TabsTrigger value="drip">Drip Campaigns</TabsTrigger>
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Automation Workflows</h2>
            <Button onClick={() => {
              setEditingWorkflow(null)
              setWorkflowForm({
                name: '',
                description: '',
                trigger_type: 'keyword',
                action_type: 'send_sms',
                trigger_config: {},
                action_config: {}
              })
              setIsWorkflowDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map(workflow => (
                <Card key={workflow.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {workflow.name}
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingWorkflow(workflow)
                          setWorkflowForm({
                            name: workflow.name,
                            description: workflow.description,
                            trigger_type: workflow.trigger_type,
                            action_type: workflow.action_type,
                            trigger_config: (workflow as any).trigger_config || {},
                            action_config: (workflow as any).action_config || {}
                          })
                          setIsWorkflowDialogOpen(true)
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete('workflows', workflow.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Trigger:</span>
                        <Badge variant="outline">{workflow.trigger_type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Action:</span>
                        <Badge variant="outline">{workflow.action_type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={workflow.is_active}
                            onCheckedChange={() => toggleActive('workflows', workflow.id, workflow.is_active)}
                          />
                          <span className="text-sm">{workflow.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                      Created: {formatDateTime(workflow.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Keyword Triggers Tab */}
        <TabsContent value="keywords">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Keyword Triggers</h2>
            <Button onClick={() => {
              setEditingKeyword(null)
              setKeywordForm({
                keyword: '',
                response_message: '',
                is_case_sensitive: false
              })
              setIsKeywordDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Trigger
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keywordTriggers.map(trigger => (
              <Card key={trigger.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span className="font-mono">{trigger.keyword}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingKeyword(trigger)
                        setKeywordForm({
                          keyword: trigger.keyword,
                          response_message: trigger.response_message,
                          is_case_sensitive: trigger.is_case_sensitive
                        })
                        setIsKeywordDialogOpen(true)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete('keyword-triggers', trigger.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Response:</span>
                      <p className="text-sm text-gray-600 mt-1">{trigger.response_message}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Case Sensitive:</span>
                      <Badge variant={trigger.is_case_sensitive ? "default" : "outline"}>
                        {trigger.is_case_sensitive ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={trigger.is_active}
                          onCheckedChange={() => toggleActive('keyword-triggers', trigger.id, trigger.is_active)}
                        />
                        <span className="text-sm">{trigger.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-4">
                    Created: {formatDateTime(trigger.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Drip Campaigns Tab */}
        <TabsContent value="drip">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Drip Campaigns</h2>
            <Button onClick={() => {
              setEditingDrip(null)
              setDripForm({
                name: '',
                description: '',
                steps: []
              })
              setIsDripDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dripCampaigns.map(campaign => (
              <Card key={campaign.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {campaign.name}
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingDrip(campaign)
                        setDripForm({
                          name: campaign.name,
                          description: campaign.description,
                          steps: []
                        })
                        setIsDripDialogOpen(true)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete('drip-campaigns', campaign.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={campaign.is_active}
                        onCheckedChange={() => toggleActive('drip-campaigns', campaign.id, campaign.is_active)}
                      />
                      <span className="text-sm">{campaign.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-4">
                    Created: {formatDateTime(campaign.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Dialog */}
      <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingWorkflow ? 'Edit Workflow' : 'Create Automation Workflow'}</DialogTitle>
            <DialogDescription>
              {editingWorkflow ? 'Update your automation workflow.' : 'Create a new automation workflow to trigger actions based on events.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWorkflowSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={workflowForm.name}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="trigger_type">Trigger Type</Label>
                <select
                  id="trigger_type"
                  value={workflowForm.trigger_type}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, trigger_type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="keyword">Keyword</option>
                  <option value="schedule">Schedule</option>
                  <option value="webhook">Webhook</option>
                  <option value="contact_action">Contact Action</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={workflowForm.description}
                onChange={(e) => setWorkflowForm({ ...workflowForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="action_type">Action Type</Label>
                <select
                  id="action_type"
                  value={workflowForm.action_type}
                  onChange={(e) => setWorkflowForm({ ...workflowForm, action_type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="send_sms">Send SMS</option>
                  <option value="add_to_group">Add to Group</option>
                  <option value="remove_from_group">Remove from Group</option>
                  <option value="update_contact">Update Contact</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingWorkflow ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Keyword Dialog */}
      <Dialog open={isKeywordDialogOpen} onOpenChange={setIsKeywordDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingKeyword ? 'Edit Keyword Trigger' : 'Create Keyword Trigger'}</DialogTitle>
            <DialogDescription>
              {editingKeyword ? 'Update your keyword trigger.' : 'Create a keyword trigger that responds to specific words in incoming messages.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleKeywordSubmit} className="grid gap-4 py-4">
            <div>
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                value={keywordForm.keyword}
                onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                placeholder="e.g., HELP, STOP, INFO"
                required
              />
            </div>
            <div>
              <Label htmlFor="response_message">Response Message</Label>
              <Textarea
                id="response_message"
                value={keywordForm.response_message}
                onChange={(e) => setKeywordForm({ ...keywordForm, response_message: e.target.value })}
                placeholder="Enter the automatic response message"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="case_sensitive"
                checked={keywordForm.is_case_sensitive}
                onCheckedChange={(checked) => setKeywordForm({ ...keywordForm, is_case_sensitive: checked })}
              />
              <Label htmlFor="case_sensitive">Case Sensitive</Label>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingKeyword ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Drip Campaign Dialog */}
      <Dialog open={isDripDialogOpen} onOpenChange={setIsDripDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingDrip ? 'Edit Drip Campaign' : 'Create Drip Campaign'}</DialogTitle>
            <DialogDescription>
              {editingDrip ? 'Update your drip campaign.' : 'Create a drip campaign that sends a series of messages over time.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDripSubmit} className="grid gap-4 py-4">
            <div>
              <Label htmlFor="drip_name">Campaign Name</Label>
              <Input
                id="drip_name"
                value={dripForm.name}
                onChange={(e) => setDripForm({ ...dripForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="drip_description">Description</Label>
              <Textarea
                id="drip_description"
                value={dripForm.description}
                onChange={(e) => setDripForm({ ...dripForm, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingDrip ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
