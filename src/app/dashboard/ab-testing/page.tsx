'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Play, BarChart3, TrendingUp, Users, Target, Zap } from 'lucide-react'
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

interface ABTestCampaign {
  id: number
  name: string
  description?: string
  test_type: string
  status: string
  traffic_split: number
  variant_a_recipients: number
  variant_b_recipients: number
  variant_a_conversion_rate: number
  variant_b_conversion_rate: number
  statistical_significance: number
  winner_variant?: string
  created_at: string
  started_at?: string
  completed_at?: string
}

interface ABTestStats {
  total_tests: number
  running_tests: number
  completed_tests: number
  successful_tests: number
  average_improvement: number
  most_effective_test_type: string
}

export default function ABTestingPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTestCampaign | null>(null)
  const [abTests, setAbTests] = useState<ABTestCampaign[]>([])
  const [stats, setStats] = useState<ABTestStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch A/B tests
  useEffect(() => {
    const fetchABTests = async () => {
      try {
        const data = await apiService.getABTests()
        setAbTests(data)
      } catch (error) {
        console.error('Error fetching A/B tests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchStats = async () => {
      try {
        const data = await apiService.getABTestStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching A/B test stats:', error)
      }
    }

    fetchABTests()
    fetchStats()
  }, [])

  // Create A/B test
  const createTest = async (testData: any) => {
    try {
      await apiService.createABTest(testData)
      // Refresh the list
      const data = await apiService.getABTests()
      setAbTests(data)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating A/B test:', error)
    }
  }

  // Start A/B test
  const startTest = async (testId: number) => {
    try {
      await apiService.startABTest(testId)
      // Refresh the list
      const data = await apiService.getABTests()
      setAbTests(data)
    } catch (error) {
      console.error('Error starting A/B test:', error)
    }
  }

  // Analyze A/B test
  const analyzeTest = async (testId: number) => {
    try {
      await apiService.analyzeABTest(testId)
      // Refresh the list
      const data = await apiService.getABTests()
      setAbTests(data)
    } catch (error) {
      console.error('Error analyzing A/B test:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'message_content': return <Target className="h-4 w-4" />
      case 'send_time': return <Zap className="h-4 w-4" />
      case 'sender_id': return <Users className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const formatTestType = (testType: string) => {
    return testType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">A/B Testing</h1>
          <p className="text-gray-600">Test different campaign variations to optimize performance</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create A/B Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
              <DialogDescription>
                Create a new A/B test to compare different campaign variations
              </DialogDescription>
            </DialogHeader>
            <CreateABTestForm 
              onSubmit={createTest}
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
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_tests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running Tests</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.running_tests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Tests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.successful_tests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.average_improvement.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* A/B Tests List */}
      <Card>
        <CardHeader>
          <CardTitle>A/B Test Campaigns</CardTitle>
          <CardDescription>Manage and monitor your A/B test campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading A/B tests...</div>
          ) : abTests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No A/B tests found. Create your first test to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {abTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTestTypeIcon(test.test_type)}
                      <div>
                        <h3 className="font-semibold">{test.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatTestType(test.test_type)} • {test.traffic_split * 100}% / {(1 - test.traffic_split) * 100}% split
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => startTest(test.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {test.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => analyzeTest(test.id)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {test.status === 'running' && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {test.variant_a_conversion_rate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Variant A</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {test.variant_b_conversion_rate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Variant B</div>
                      </div>
                    </div>
                  )}
                  
                  {test.winner_variant && test.winner_variant !== 'inconclusive' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Winner: Variant {test.winner_variant.toUpperCase()}
                        </span>
                        <span className="text-green-600">
                          ({test.statistical_significance.toFixed(1)}% confidence)
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
    </div>
  )
}

// Create A/B Test Form Component
function CreateABTestForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    test_type: 'message_content',
    traffic_split: 0.5,
    test_duration_days: 7,
    minimum_sample_size: 100,
    confidence_level: 0.95,
    variants: [
      { variant_name: 'A', message_content: '' },
      { variant_name: 'B', message_content: '' }
    ]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Test Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="test_type">Test Type</Label>
          <Select
            value={formData.test_type}
            onValueChange={(value) => setFormData({ ...formData, test_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="message_content">Message Content</SelectItem>
              <SelectItem value="send_time">Send Time</SelectItem>
              <SelectItem value="sender_id">Sender ID</SelectItem>
              <SelectItem value="subject_line">Subject Line</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="traffic_split">Traffic Split (Variant A)</Label>
          <Input
            id="traffic_split"
            type="number"
            min="0.1"
            max="0.9"
            step="0.1"
            value={formData.traffic_split}
            onChange={(e) => setFormData({ ...formData, traffic_split: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="test_duration_days">Test Duration (Days)</Label>
          <Input
            id="test_duration_days"
            type="number"
            min="1"
            max="30"
            value={formData.test_duration_days}
            onChange={(e) => setFormData({ ...formData, test_duration_days: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <Label>Test Variants</Label>
        {formData.variants.map((variant, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Variant {variant.variant_name}</h4>
            </div>
            <Textarea
              placeholder="Enter message content for this variant..."
              value={variant.message_content}
              onChange={(e) => updateVariant(index, 'message_content', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create A/B Test'}
        </Button>
      </div>
    </form>
  )
}
