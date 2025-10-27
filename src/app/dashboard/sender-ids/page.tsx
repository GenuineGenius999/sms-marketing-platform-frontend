'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { api } from '@/lib/api'

interface SenderId {
  id: number
  sender_id: string
  is_approved: boolean
  created_at: string
  user_id: number
}

export default function SenderIdsPage() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    sender_id: ''
  })

  useEffect(() => {
    fetchSenderIds()
  }, [])

  const fetchSenderIds = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockData: SenderId[] = [
        {
          id: 1,
          sender_id: 'MyCompany',
          is_approved: true,
          created_at: '2024-01-15T10:30:00Z',
          user_id: 1
        },
        {
          id: 2,
          sender_id: 'SMSAlert',
          is_approved: false,
          created_at: '2024-01-20T14:45:00Z',
          user_id: 1
        },
        {
          id: 3,
          sender_id: 'NotifyMe',
          is_approved: true,
          created_at: '2024-01-25T09:15:00Z',
          user_id: 1
        }
      ]
      setSenderIds(mockData)
    } catch (error) {
      console.error('Error fetching sender IDs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Update existing sender ID
        // await api.put(`/sender-ids/${editingId}`, formData)
        console.log('Updating sender ID:', editingId, formData)
      } else {
        // Create new sender ID
        // await api.post('/sender-ids', formData)
        console.log('Creating sender ID:', formData)
      }
      
      setIsDialogOpen(false)
      setEditingId(null)
      setFormData({ sender_id: '' })
      fetchSenderIds()
    } catch (error) {
      console.error('Error saving sender ID:', error)
    }
  }

  const handleEdit = (senderId: SenderId) => {
    setEditingId(senderId.id)
    setFormData({ sender_id: senderId.sender_id })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this sender ID?')) {
      try {
        // await api.delete(`/sender-ids/${id}`)
        console.log('Deleting sender ID:', id)
        fetchSenderIds()
      } catch (error) {
        console.error('Error deleting sender ID:', error)
      }
    }
  }

  const getStatusIcon = (isApproved: boolean) => {
    if (isApproved) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    return <Clock className="h-4 w-4 text-yellow-600" />
  }

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading sender IDs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sender IDs</h1>
          <p className="text-gray-600">Manage your SMS sender identifiers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingId(null)
              setFormData({ sender_id: '' })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sender ID
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Sender ID' : 'Add New Sender ID'}
              </DialogTitle>
              <DialogDescription>
                {editingId 
                  ? 'Update your sender ID information.' 
                  : 'Create a new sender ID for your SMS campaigns.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sender_id">Sender ID</Label>
                <Input
                  id="sender_id"
                  value={formData.sender_id}
                  onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })}
                  placeholder="Enter sender ID (max 11 characters)"
                  maxLength={11}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Maximum 11 characters. Use alphanumeric characters only.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Sender ID
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {senderIds.map((senderId) => (
          <Card key={senderId.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{senderId.sender_id}</CardTitle>
                {getStatusIcon(senderId.is_approved)}
              </div>
              <CardDescription>
                Created: {new Date(senderId.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(senderId.is_approved)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(senderId)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(senderId.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {senderIds.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Sender IDs</h3>
              <p className="text-sm">Get started by creating your first sender ID.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sender ID Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Sender ID Guidelines</CardTitle>
          <CardDescription>Important information about sender IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Requirements:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maximum 11 characters</li>
                <li>• Alphanumeric characters only</li>
                <li>• No spaces or special characters</li>
                <li>• Must be approved before use</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use your company name</li>
                <li>• Keep it short and memorable</li>
                <li>• Avoid generic terms</li>
                <li>• Check availability first</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
