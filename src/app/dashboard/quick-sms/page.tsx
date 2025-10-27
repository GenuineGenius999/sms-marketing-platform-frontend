'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSendQuickSms } from '@/hooks/use-api'
import { Send, Phone, MessageSquare } from 'lucide-react'

export default function QuickSmsPage() {
  const [phoneNumbers, setPhoneNumbers] = useState('')
  const [message, setMessage] = useState('')
  const sendSmsMutation = useSendQuickSms()

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumbers.trim() || !message.trim()) {
      alert('Please enter phone numbers and message')
      return
    }

    const phoneList = phoneNumbers.split('\n').map(phone => phone.trim()).filter(phone => phone)

    if (phoneList.length === 0) {
      alert('Please enter at least one valid phone number')
      return
    }

    sendSmsMutation.mutate({
      phoneNumbers: phoneList,
      message
    })
  }

  const handlePhoneNumbersChange = (value: string) => {
    setPhoneNumbers(value)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quick SMS</h1>
        <p className="text-gray-600">Send SMS messages instantly to multiple recipients</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Quick SMS
            </CardTitle>
            <CardDescription>
              Enter phone numbers (one per line) and your message to send instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendSms} className="space-y-6">
              <div>
                <Label htmlFor="phoneNumbers">Phone Numbers</Label>
                <Textarea
                  id="phoneNumbers"
                  value={phoneNumbers}
                  onChange={(e) => handlePhoneNumbersChange(e.target.value)}
                  placeholder="Enter phone numbers, one per line:&#10;+1234567890&#10;+0987654321&#10;+1122334455"
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter one phone number per line. Include country code (e.g., +1 for US)
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your SMS message here..."
                  rows={4}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500">
                    Character count: {message.length}/160
                  </p>
                  <p className="text-sm text-gray-500">
                    SMS count: {Math.ceil(message.length / 160)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Phone className="h-4 w-4" />
                    <span>Recipients: {phoneNumbers.split('\n').filter(p => p.trim()).length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <MessageSquare className="h-4 w-4" />
                    <span>Message: {message || 'No message entered'}</span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={sendSmsMutation.isLoading || !phoneNumbers.trim() || !message.trim()}
              >
                {sendSmsMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send SMS
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Better SMS Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Always include country code (e.g., +1 for US, +44 for UK)</li>
              <li>• Keep messages under 160 characters for single SMS</li>
              <li>• Avoid spam trigger words and excessive punctuation</li>
              <li>• Test with a small group before sending to large lists</li>
              <li>• Include opt-out instructions for marketing messages</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
