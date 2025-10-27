'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { api } from '@/lib/api'
import { Plus, Edit, Trash2, Users, Tag, Filter, Search, Target, BarChart3 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Segment {
  id: number
  name: string
  description: string
  segment_type: string
  conditions: any
  is_active: boolean
  contact_count: number
  created_at: string
  updated_at: string
}

interface ContactTag {
  id: number
  name: string
  color: string
  description: string
  contact_count: number
  created_at: string
}

interface Contact {
  id: number
  name: string
  phone: string
  email: string
  tags: string[]
  engagement_score: number
  last_activity: string
}

export default function SegmentationPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [tags, setTags] = useState<ContactTag[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [isSegmentDialogOpen, setIsSegmentDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null)
  const [editingTag, setEditingTag] = useState<ContactTag | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)

  const [segmentForm, setSegmentForm] = useState({
    name: '',
    description: '',
    segment_type: 'static',
    conditions: {}
  })

  const [tagForm, setTagForm] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // In a real implementation, you'd have endpoints for segments and tags
      // For now, we'll simulate with mock data
      const [contactsRes] = await Promise.all([
        api.get('/contacts/')
      ])
      
      setContacts(contactsRes.data)
      
      // Mock segments and tags for demonstration
      setSegments([
        {
          id: 1,
          name: 'High Engagement',
          description: 'Contacts with high engagement scores',
          segment_type: 'behavioral',
          conditions: { engagement_score: { min: 80 } },
          is_active: true,
          contact_count: 45,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'New Contacts',
          description: 'Contacts added in the last 30 days',
          segment_type: 'demographic',
          conditions: { created_at: { after: '2024-01-01' } },
          is_active: true,
          contact_count: 23,
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z'
        }
      ])
      
      setTags([
        {
          id: 1,
          name: 'VIP',
          color: '#F59E0B',
          description: 'VIP customers',
          contact_count: 12,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Newsletter',
          color: '#10B981',
          description: 'Newsletter subscribers',
          contact_count: 89,
          created_at: '2024-01-10T10:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSegmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSegment) {
        // Update segment
        console.log('Updating segment:', segmentForm)
      } else {
        // Create segment
        console.log('Creating segment:', segmentForm)
      }
      
      setIsSegmentDialogOpen(false)
      setEditingSegment(null)
      setSegmentForm({
        name: '',
        description: '',
        segment_type: 'static',
        conditions: {}
      })
      fetchData()
    } catch (error) {
      console.error('Error saving segment:', error)
    }
  }

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTag) {
        // Update tag
        console.log('Updating tag:', tagForm)
      } else {
        // Create tag
        console.log('Creating tag:', tagForm)
      }
      
      setIsTagDialogOpen(false)
      setEditingTag(null)
      setTagForm({
        name: '',
        color: '#3B82F6',
        description: ''
      })
      fetchData()
    } catch (error) {
      console.error('Error saving tag:', error)
    }
  }

  const handleDelete = async (type: string, id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        console.log(`Deleting ${type} ${id}`)
        fetchData()
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  const toggleActive = async (type: string, id: number, isActive: boolean) => {
    try {
      console.log(`Toggling ${type} ${id} to ${!isActive}`)
      fetchData()
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  const getSegmentTypeIcon = (type: string) => {
    switch (type) {
      case 'behavioral': return <BarChart3 className="h-4 w-4" />
      case 'demographic': return <Users className="h-4 w-4" />
      case 'static': return <Filter className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getSegmentTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-purple-100 text-purple-800'
      case 'demographic': return 'bg-blue-100 text-blue-800'
      case 'static': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Segmentation</h1>
          <p className="text-gray-600">Organize and segment your contacts for targeted messaging</p>
        </div>
      </div>

      <Tabs defaultValue="segments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="contacts">Contact View</TabsTrigger>
        </TabsList>

        {/* Segments Tab */}
        <TabsContent value="segments">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contact Segments</h2>
            <Button onClick={() => {
              setEditingSegment(null)
              setSegmentForm({
                name: '',
                description: '',
                segment_type: 'static',
                conditions: {}
              })
              setIsSegmentDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Segment
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
              {segments.map(segment => (
                <Card key={segment.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {getSegmentTypeIcon(segment.segment_type)}
                        {segment.name}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingSegment(segment)
                          setSegmentForm({
                            name: segment.name,
                            description: segment.description,
                            segment_type: segment.segment_type,
                            conditions: segment.conditions
                          })
                          setIsSegmentDialogOpen(true)
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete('segments', segment.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{segment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type:</span>
                        <Badge className={getSegmentTypeColor(segment.segment_type)}>
                          {segment.segment_type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Contacts:</span>
                        <span className="text-sm font-bold">{segment.contact_count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={segment.is_active}
                            onCheckedChange={() => toggleActive('segments', segment.id, segment.is_active)}
                          />
                          <span className="text-sm">{segment.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                      Created: {formatDateTime(segment.created_at)}
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full" 
                      onClick={() => setSelectedSegment(segment)}
                    >
                      View Contacts
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contact Tags</h2>
            <Button onClick={() => {
              setEditingTag(null)
              setTagForm({
                name: '',
                color: '#3B82F6',
                description: ''
              })
              setIsTagDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tags.map(tag => (
              <Card key={tag.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      {tag.name}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditingTag(tag)
                        setTagForm({
                          name: tag.name,
                          color: tag.color,
                          description: tag.description
                        })
                        setIsTagDialogOpen(true)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete('tags', tag.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{tag.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Contacts:</span>
                    <span className="text-sm font-bold">{tag.contact_count}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-4">
                    Created: {formatDateTime(tag.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">All Contacts</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    {segments.map(segment => (
                      <SelectItem key={segment.id} value={segment.id.toString()}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts
                .filter(contact => 
                  contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  contact.phone.includes(searchTerm) ||
                  contact.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(contact => (
                <Card key={contact.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-lg">{contact.name}</span>
                      <Badge variant="outline">
                        Score: {contact.engagement_score}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-4">
                      Last activity: {formatDateTime(contact.last_activity)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Segment Dialog */}
      <Dialog open={isSegmentDialogOpen} onOpenChange={setIsSegmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSegment ? 'Edit Segment' : 'Create Contact Segment'}</DialogTitle>
            <DialogDescription>
              {editingSegment ? 'Update your contact segment.' : 'Create a new segment to organize your contacts based on specific criteria.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSegmentSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="segment_name">Name</Label>
                <Input
                  id="segment_name"
                  value={segmentForm.name}
                  onChange={(e) => setSegmentForm({ ...segmentForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="segment_type">Segment Type</Label>
                <Select
                  value={segmentForm.segment_type}
                  onValueChange={(value) => setSegmentForm({ ...segmentForm, segment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="demographic">Demographic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="segment_description">Description</Label>
              <Textarea
                id="segment_description"
                value={segmentForm.description}
                onChange={(e) => setSegmentForm({ ...segmentForm, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingSegment ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'Create Contact Tag'}</DialogTitle>
            <DialogDescription>
              {editingTag ? 'Update your contact tag.' : 'Create a new tag to categorize your contacts.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTagSubmit} className="grid gap-4 py-4">
            <div>
              <Label htmlFor="tag_name">Name</Label>
              <Input
                id="tag_name"
                value={tagForm.name}
                onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="tag_color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={tagForm.color}
                  onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={tagForm.color}
                  onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tag_description">Description</Label>
              <Textarea
                id="tag_description"
                value={tagForm.description}
                onChange={(e) => setTagForm({ ...tagForm, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingTag ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
