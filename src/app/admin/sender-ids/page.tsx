'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  UserCheck,
  Building,
  Phone
} from 'lucide-react'
import { api } from '@/lib/api'

interface SenderId {
  id: number
  sender_id: string
  user_id: number
  user_name: string
  user_email: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export default function AdminSenderIdsPage() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSenderId, setEditingSenderId] = useState<SenderId | null>(null)
  const [formData, setFormData] = useState({
    sender_id: '',
    user_id: '',
    is_approved: false
  })

  useEffect(() => {
    fetchSenderIds()
  }, [])

  const fetchSenderIds = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/sender-ids')
      setSenderIds(response.data)
    } catch (error) {
      console.error('Error fetching sender IDs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSenderId = async () => {
    try {
      const response = await api.post('/admin/sender-ids', {
        sender_id: formData.sender_id,
        user_id: parseInt(formData.user_id),
        is_approved: formData.is_approved
      })
      
      setSenderIds([...senderIds, response.data])
      setIsDialogOpen(false)
      setFormData({ sender_id: '', user_id: '', is_approved: false })
    } catch (error) {
      console.error('Error creating sender ID:', error)
    }
  }

  const handleApproveSenderId = async (id: number) => {
    try {
      await api.put(`/admin/sender-ids/${id}/approve`)
      setSenderIds(senderIds.map(s => s.id === id ? { ...s, is_approved: true } : s))
    } catch (error) {
      console.error('Error approving sender ID:', error)
    }
  }

  const handleRejectSenderId = async (id: number) => {
    try {
      await api.put(`/admin/sender-ids/${id}/reject`)
      setSenderIds(senderIds.map(s => s.id === id ? { ...s, is_approved: false } : s))
    } catch (error) {
      console.error('Error rejecting sender ID:', error)
    }
  }

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      )
    }
  }

  const filteredSenderIds = senderIds.filter(senderId => {
    const matchesSearch = senderId.sender_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         senderId.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         senderId.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && senderId.is_approved) ||
                         (statusFilter === 'pending' && !senderId.is_approved)
    
    return matchesSearch && matchesStatus
  })

  const uniqueUsers = Array.from(new Set(senderIds.map(s => ({ id: s.user_id, name: s.user_name, email: s.user_email }))))

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
          <h1 className="text-3xl font-bold">Sender ID Management</h1>
          <p className="text-gray-600">Approve and manage sender IDs for all users</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Sender ID
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sender ID</DialogTitle>
              <DialogDescription>
                Create a new sender ID for a user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sender_id">Sender ID</Label>
                <Input
                  id="sender_id"
                  placeholder="Enter sender ID (e.g., COMPANY)"
                  value={formData.sender_id}
                  onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="user_id">User</Label>
                <Select value={formData.user_id} onValueChange={(value) => setFormData({ ...formData, user_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueUsers.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_approved"
                  checked={formData.is_approved}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_approved: checked })}
                />
                <Label htmlFor="is_approved">Approved</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSenderId}>
                  Create Sender ID
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sender IDs</p>
                <p className="text-2xl font-bold">{senderIds.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {senderIds.filter(s => s.is_approved).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {senderIds.filter(s => !s.is_approved).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold">
                  {senderIds.length > 0 ? Math.round(
                    (senderIds.filter(s => s.is_approved).length / senderIds.length) * 100
                  ) : 0}%
                </p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sender IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchSenderIds} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sender IDs List */}
      <Card>
        <CardHeader>
          <CardTitle>All Sender IDs ({filteredSenderIds.length})</CardTitle>
          <CardDescription>
            Manage and approve sender IDs for all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSenderIds.map((senderId) => (
              <div key={senderId.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{senderId.sender_id}</h3>
                      {getStatusBadge(senderId.is_approved)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>User: {senderId.user_name} ({senderId.user_email})</span>
                      <span>•</span>
                      <span>Created: {new Date(senderId.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(senderId.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!senderId.is_approved ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveSenderId(senderId.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectSenderId(senderId.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectSenderId(senderId.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
