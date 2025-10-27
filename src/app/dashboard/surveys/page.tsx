'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Play, BarChart3, MessageSquare, Users, Target, Zap, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { apiService } from '@/lib/api-service'

interface Survey {
  id: number
  title: string
  description?: string
  status: string
  total_sent: number
  total_responses: number
  completion_rate: number
  average_rating: number
  created_at: string
  started_at?: string
  ended_at?: string
}

interface SurveyStats {
  total_surveys: number
  active_surveys: number
  completed_surveys: number
  total_responses: number
  average_response_rate: number
  most_popular_question_type: string
}

export default function SurveysPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const data = await apiService.getSurveys()
        setSurveys(data)
      } catch (error) {
        console.error('Error fetching surveys:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const data = await apiService.getSurveyStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching survey stats:', error)
      }
    }

    fetchSurveys()
    fetchStats()
  }, [])

  // Create survey
  const createSurvey = async (surveyData: any) => {
    try {
      await apiService.createSurvey(surveyData)
      // Refresh the list
      const data = await apiService.getSurveys()
      setSurveys(data)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating survey:', error)
    }
  }

  // Send survey
  const sendSurvey = async (surveyId: number) => {
    try {
      await apiService.sendSurvey(surveyId)
      // Refresh the list
      const data = await apiService.getSurveys()
      setSurveys(data)
    } catch (error) {
      console.error('Error sending survey:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Surveys</h1>
          <p className="text-gray-600">Create and manage SMS surveys to collect feedback</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Survey</DialogTitle>
              <DialogDescription>
                Create a new SMS survey to collect feedback from your contacts
              </DialogDescription>
            </DialogHeader>
            <CreateSurveyForm 
              onSubmit={createSurvey}
              isLoading={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_surveys}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active_surveys}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total_responses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.average_response_rate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Surveys List */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Campaigns</CardTitle>
          <CardDescription>Manage and monitor your SMS surveys</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading surveys...</div>
          ) : surveys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No surveys found. Create your first survey to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div key={survey.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{survey.title}</h3>
                        <p className="text-sm text-gray-600">
                          {survey.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            Sent: {survey.total_sent}
                          </span>
                          <span className="text-sm text-gray-500">
                            Responses: {survey.total_responses}
                          </span>
                          <span className="text-sm text-gray-500">
                            Rate: {survey.completion_rate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(survey.status)}>
                        {survey.status}
                      </Badge>
                      {survey.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => sendSurvey(survey.id)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSurvey(survey)}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                  
                  {survey.average_rating > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">
                          Average Rating: {survey.average_rating.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Survey Analytics Dialog */}
      {selectedSurvey && (
        <Dialog open={!!selectedSurvey} onOpenChange={() => setSelectedSurvey(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Survey Analytics: {selectedSurvey.title}</DialogTitle>
              <DialogDescription>
                Detailed analytics and insights for this survey
              </DialogDescription>
            </DialogHeader>
            <SurveyAnalytics survey={selectedSurvey} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Create Survey Form Component
function CreateSurveyForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    welcome_message: '',
    thank_you_message: '',
    is_anonymous: false,
    allow_multiple_responses: false,
    sms_keyword: '',
    sender_id: '',
    auto_send: false,
    questions: [
      {
        question_text: '',
        question_type: 'text',
        question_order: 1,
        is_required: true,
        options: [],
        min_value: 1,
        max_value: 5
      }
    ]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addQuestion = () => {
    const newQuestion = {
      question_text: '',
      question_type: 'text',
      question_order: formData.questions.length + 1,
      is_required: true,
      options: [],
      min_value: 1,
      max_value: 5
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setFormData({ ...formData, questions: newQuestions })
  }

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index)
    setFormData({ ...formData, questions: newQuestions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Survey Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="sms_keyword">SMS Keyword</Label>
          <Input
            id="sms_keyword"
            value={formData.sms_keyword}
            onChange={(e) => setFormData({ ...formData, sms_keyword: e.target.value })}
            placeholder="SURVEY"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="welcome_message">Welcome Message</Label>
          <Textarea
            id="welcome_message"
            value={formData.welcome_message}
            onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
            placeholder="Thank you for participating in our survey..."
          />
        </div>
        <div>
          <Label htmlFor="thank_you_message">Thank You Message</Label>
          <Textarea
            id="thank_you_message"
            value={formData.thank_you_message}
            onChange={(e) => setFormData({ ...formData, thank_you_message: e.target.value })}
            placeholder="Thank you for your feedback!"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_anonymous"
            checked={formData.is_anonymous}
            onCheckedChange={(checked) => setFormData({ ...formData, is_anonymous: checked })}
          />
          <Label htmlFor="is_anonymous">Anonymous Responses</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="allow_multiple_responses"
            checked={formData.allow_multiple_responses}
            onCheckedChange={(checked) => setFormData({ ...formData, allow_multiple_responses: checked })}
          />
          <Label htmlFor="allow_multiple_responses">Allow Multiple Responses</Label>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Survey Questions</Label>
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
        
        {formData.questions.map((question, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Question {index + 1}</h4>
              {formData.questions.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Question Type</Label>
                <Select
                  value={question.question_type}
                  onValueChange={(value) => updateQuestion(index, 'question_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="single_choice">Single Choice</SelectItem>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="rating">Rating (1-5)</SelectItem>
                    <SelectItem value="yes_no">Yes/No</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id={`required_${index}`}
                  checked={question.is_required}
                  onCheckedChange={(checked) => updateQuestion(index, 'is_required', checked)}
                />
                <Label htmlFor={`required_${index}`}>Required</Label>
              </div>
            </div>
            
            <div className="mb-4">
              <Label>Question Text</Label>
              <Textarea
                value={question.question_text}
                onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                placeholder="Enter your question here..."
              />
            </div>
            
            {(question.question_type === 'single_choice' || question.question_type === 'multiple_choice') && (
              <div>
                <Label>Options (one per line)</Label>
                <Textarea
                  value={question.options.join('\n')}
                  onChange={(e) => updateQuestion(index, 'options', e.target.value.split('\n'))}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Survey'}
        </Button>
      </div>
    </form>
  )
}

// Survey Analytics Component
function SurveyAnalytics({ survey }: { survey: Survey }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {survey.completion_rate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">
              {survey.total_responses} of {survey.total_sent} responses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {survey.average_rating.toFixed(1)}/5
            </div>
            <p className="text-sm text-gray-600">
              Based on rating questions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Detailed analytics will be available after responses are collected</p>
      </div>
    </div>
  )
}
