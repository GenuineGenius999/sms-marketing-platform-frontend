'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import { MessageSquare, Send, Phone, Mail, User, Search, Filter, MoreVertical } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Contact {
  id: number
  name: string
  phone: string
  email: string
  last_message_at: string
  message_count: number
  is_opted_out: boolean
}

interface Message {
  id: number
  contact_id: number
  content: string
  status: string
  sent_at: string
  is_incoming: boolean
  message_id: string
}

interface Conversation {
  contact: Contact
  messages: Message[]
  unread_count: number
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      // In a real implementation, you'd have an endpoint to get conversations
      // For now, we'll simulate with contacts and messages
      const [contactsRes, messagesRes] = await Promise.all([
        api.get('/contacts/'),
        api.get('/messages/')
      ])
      
      const contacts = contactsRes.data
      const allMessages = messagesRes.data
      
      // Group messages by contact
      const conversationMap = new Map<number, Conversation>()
      
      contacts.forEach((contact: Contact) => {
        const contactMessages = allMessages.filter((msg: Message) => msg.contact_id === contact.id)
        const unreadCount = contactMessages.filter((msg: Message) => msg.is_incoming && msg.status === 'received').length
        
        conversationMap.set(contact.id, {
          contact: {
            ...contact,
            last_message_at: contactMessages.length > 0 
              ? contactMessages[contactMessages.length - 1].sent_at 
              : (contact as any).created_at || new Date().toISOString(),
            message_count: contactMessages.length
          },
          messages: contactMessages.sort((a: Message, b: Message) => 
            new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
          ),
          unread_count: unreadCount
        })
      })
      
      setConversations(Array.from(conversationMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (contactId: number) => {
    try {
      const response = await api.get(`/two-way-sms/conversations?contact_id=${contactId}`)
      setMessages(response.data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    fetchMessages(contact.id)
  }

  const handleSendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return
    
    try {
      setSending(true)
      await api.post('/two-way-sms/send-reply', {
        contact_id: selectedContact.id,
        message: replyMessage
      })
      
      setReplyMessage('')
      setIsReplyDialogOpen(false)
      fetchMessages(selectedContact.id)
      fetchConversations()
    } catch (error) {
      console.error('Error sending reply:', error)
    } finally {
      setSending(false)
    }
  }

  const handleOptOut = async (contactId: number) => {
    if (confirm('Are you sure you want to opt out this contact?')) {
      try {
        await api.post('/two-way-sms/opt-out', { contact_id: contactId })
        fetchConversations()
        if (selectedContact?.id === contactId) {
          setSelectedContact(null)
          setMessages([])
        }
      } catch (error) {
        console.error('Error opting out contact:', error)
      }
    }
  }

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.contact.phone.includes(searchTerm)
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && conversation.unread_count > 0) ||
                         (filterStatus === 'opted_out' && conversation.contact.is_opted_out)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
          <p className="text-gray-600">Manage two-way SMS conversations with your contacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Conversations
              </CardTitle>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="unread">Unread Messages</SelectItem>
                    <SelectItem value="opted_out">Opted Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-2 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded mb-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.contact.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedContact?.id === conversation.contact.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleContactSelect(conversation.contact)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.contact.name}
                            </h3>
                            {conversation.unread_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unread_count}
                              </Badge>
                            )}
                            {conversation.contact.is_opted_out && (
                              <Badge variant="outline" className="text-xs">
                                Opted Out
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.contact.phone}
                          </p>
                          <p className="text-xs text-gray-400">
                            {conversation.contact.message_count} messages • {formatDateTime(conversation.contact.last_message_at)}
                          </p>
                        </div>
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2">
          {selectedContact ? (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedContact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{selectedContact.name}</h3>
                      <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsReplyDialogOpen(true)}
                      disabled={selectedContact.is_opted_out}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOptOut(selectedContact.id)}
                    >
                      Opt Out
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_incoming ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.is_incoming
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.is_incoming ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          {formatDateTime(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Reply */}
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a quick reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendReply()
                        }
                      }}
                      disabled={selectedContact.is_opted_out}
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || sending || selectedContact.is_opted_out}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedContact.is_opted_out && (
                    <p className="text-sm text-red-500 mt-2">
                      This contact has opted out and cannot receive messages.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Conversation</h3>
                <p className="text-gray-500">Choose a contact to view the conversation</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Reply</DialogTitle>
            <DialogDescription>
              Send a reply to {selectedContact?.name} ({selectedContact?.phone})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
            />
            <div className="text-sm text-gray-500">
              Character count: {replyMessage.length}/160
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSendReply}
              disabled={!replyMessage.trim() || sending}
            >
              {sending ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
