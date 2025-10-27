'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock, Send } from 'lucide-react'
import { format } from 'date-fns'

interface CampaignSchedulerProps {
  onSchedule: (campaignData: any) => void
  contacts: any[]
  groups: any[]
}

export default function CampaignScheduler({ onSchedule, contacts, groups }: CampaignSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [campaignData, setCampaignData] = useState({
    name: '',
    message: '',
    scheduledDate: new Date(),
    scheduledTime: '09:00',
    recipientType: 'all', // 'all', 'group', 'selected'
    selectedGroup: '',
    selectedContacts: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const scheduledDateTime = new Date(campaignData.scheduledDate)
    const [hours, minutes] = campaignData.scheduledTime.split(':')
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes))
    
    const finalCampaignData = {
      ...campaignData,
      scheduled_at: scheduledDateTime.toISOString(),
      status: 'scheduled'
    }
    
    onSchedule(finalCampaignData)
    setIsOpen(false)
    
    // Reset form
    setCampaignData({
      name: '',
      message: '',
      scheduledDate: new Date(),
      scheduledTime: '09:00',
      recipientType: 'all',
      selectedGroup: '',
      selectedContacts: []
    })
  }

  const handleContactToggle = (contactId: string) => {
    setCampaignData(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.includes(contactId)
        ? prev.selectedContacts.filter(id => id !== contactId)
        : [...prev.selectedContacts, contactId]
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Clock className="w-4 h-4 mr-2" />
          Schedule Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule SMS Campaign</DialogTitle>
          <DialogDescription>
            Create a scheduled campaign that will be sent automatically at the specified time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={campaignData.message}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your SMS message"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {campaignData.message.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(campaignData.scheduledDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={campaignData.scheduledDate}
                        onSelect={(date) => date && setCampaignData(prev => ({ ...prev, scheduledDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={campaignData.scheduledTime}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Recipient Type</Label>
                <Select
                  value={campaignData.recipientType}
                  onValueChange={(value) => setCampaignData(prev => ({ ...prev, recipientType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="group">Specific Group</SelectItem>
                    <SelectItem value="selected">Selected Contacts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {campaignData.recipientType === 'group' && (
                <div>
                  <Label>Select Group</Label>
                  <Select
                    value={campaignData.selectedGroup}
                    onValueChange={(value) => setCampaignData(prev => ({ ...prev, selectedGroup: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name} ({group.contact_count} contacts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {campaignData.recipientType === 'selected' && (
                <div>
                  <Label>Select Contacts</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    {contacts.map((contact) => (
                      <label key={contact.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={campaignData.selectedContacts.includes(contact.id.toString())}
                          onChange={() => handleContactToggle(contact.id.toString())}
                          className="rounded"
                        />
                        <span className="text-sm">{contact.name} ({contact.phone})</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {campaignData.selectedContacts.length} contacts selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="min-w-[120px]">
              <Send className="w-4 h-4 mr-2" />
              Schedule Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
