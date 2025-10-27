'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Contact, ContactGroup } from '@/types'
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react'
import BulkImport from '@/components/bulk-import'

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const queryClient = useQueryClient()

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

  const addContactMutation = useMutation(
    async (contactData: Partial<Contact>) => {
      const response = await api.post('/contacts/', contactData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts')
        setShowAddForm(false)
      }
    }
  )

  const deleteContactMutation = useMutation(
    async (contactId: string) => {
      await api.delete(`/contacts/${contactId}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts')
      }
    }
  )

  const filteredContacts = contacts?.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  ) || []

  const handleAddContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const contactData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      group_id: selectedGroup ? parseInt(selectedGroup) : undefined
    }
    addContactMutation.mutate(contactData)
  }

  if (contactsLoading || groupsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your contact database</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          <BulkImport onImportComplete={() => queryClient.invalidateQueries('contacts')} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Groups</option>
          {groups?.map(group => (
            <option key={group.id} value={group.id.toString()}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Contact</CardTitle>
            <CardDescription>Enter the contact details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <div>
                  <Label htmlFor="group">Group</Label>
                  <select
                    id="group"
                    name="group"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Group</option>
                    {groups?.map(group => (
                      <option key={group.id} value={group.id.toString()}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addContactMutation.isLoading}>
                  {addContactMutation.isLoading ? 'Adding...' : 'Add Contact'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <CardDescription>{contact.phone}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteContactMutation.mutate(contact.id.toString())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {contact.email && (
                <p className="text-sm text-gray-600 mb-2">{contact.email}</p>
              )}
              {contact.groupId && (
                <div className="flex items-center text-sm text-blue-600">
                  <Users className="h-4 w-4 mr-1" />
                  {groups?.find(g => g.id === contact.groupId)?.name}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500">Get started by adding your first contact.</p>
        </div>
      )}
    </div>
  )
}
