'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Users, UserPlus, UserMinus, Search, Filter } from 'lucide-react'
import { api } from '@/lib/api'

interface ContactGroup {
  id: number
  name: string
  description: string
  contact_count: number
  created_at: string
  updated_at: string
  user_id: number
}

interface Contact {
  id: number
  name: string
  phone: string
  email: string
  group_id: number | null
}

export default function ContactGroupsPage() {
  const [groups, setGroups] = useState<ContactGroup[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchGroups()
    fetchContacts()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await api.get('/contacts/groups/')
      setGroups(response.data)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts/')
      setContacts(response.data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingGroup) {
        // Update existing group
        await api.put(`/contacts/groups/${editingGroup.id}`, formData)
      } else {
        // Create new group
        await api.post('/contacts/groups/', formData)
      }
      
      setIsDialogOpen(false)
      setEditingGroup(null)
      setFormData({ name: '', description: '' })
      fetchGroups()
    } catch (error) {
      console.error('Error saving group:', error)
    }
  }

  const handleEdit = (group: ContactGroup) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      description: group.description
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this group? This will not delete the contacts, but will remove them from the group.')) {
      try {
        await api.delete(`/contacts/groups/${id}`)
        fetchGroups()
      } catch (error) {
        console.error('Error deleting group:', error)
      }
    }
  }

  const addContactToGroup = async (contactId: number, groupId: number) => {
    try {
      // await api.put(`/contacts/${contactId}`, { group_id: groupId })
      console.log('Adding contact to group:', contactId, groupId)
      fetchContacts()
    } catch (error) {
      console.error('Error adding contact to group:', error)
    }
  }

  const removeContactFromGroup = async (contactId: number) => {
    try {
      // await api.put(`/contacts/${contactId}`, { group_id: null })
      console.log('Removing contact from group:', contactId)
      fetchContacts()
    } catch (error) {
      console.error('Error removing contact from group:', error)
    }
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGroupContacts = (groupId: number) => {
    return contacts.filter(contact => contact.group_id === groupId)
  }

  const getUnassignedContacts = () => {
    return contacts.filter(contact => contact.group_id === null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading contact groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Groups</h1>
          <p className="text-gray-600">Organize your contacts into groups for targeted campaigns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingGroup(null)
              setFormData({ name: '', description: '' })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Edit Group' : 'Add New Group'}
              </DialogTitle>
              <DialogDescription>
                {editingGroup 
                  ? 'Update group information and settings.' 
                  : 'Create a new contact group for organizing your contacts.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter group description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGroup ? 'Update' : 'Create'} Group
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="mt-1">{group.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Users className="h-3 w-3 mr-1" />
                  {group.contact_count}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>Created: {new Date(group.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(group.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(group)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
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

      {filteredGroups.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Groups Found</h3>
              <p className="text-sm">
                {searchTerm 
                  ? 'Try adjusting your search criteria.' 
                  : 'Get started by creating your first contact group.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Management Modal */}
      {selectedGroup && (
        <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Manage Group: {selectedGroup.name}</DialogTitle>
              <DialogDescription>
                Add or remove contacts from this group
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Current Group Members */}
              <div>
                <h3 className="text-lg font-medium mb-3">Current Members ({getGroupContacts(selectedGroup.id).length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getGroupContacts(selectedGroup.id).map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone} • {contact.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeContactFromGroup(contact.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                  {getGroupContacts(selectedGroup.id).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No contacts in this group</p>
                  )}
                </div>
              </div>

              {/* Available Contacts */}
              <div>
                <h3 className="text-lg font-medium mb-3">Available Contacts ({getUnassignedContacts().length})</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getUnassignedContacts().map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phone} • {contact.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addContactToGroup(contact.id, selectedGroup.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                  {getUnassignedContacts().length === 0 && (
                    <p className="text-gray-500 text-center py-4">All contacts are assigned to groups</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
