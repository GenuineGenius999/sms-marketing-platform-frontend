'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Save, User, Bell, Shield, CreditCard, Smartphone } from 'lucide-react'
import { api } from '@/lib/api'

interface UserSettings {
  name: string
  email: string
  company: string
  phone: string
  timezone: string
  language: string
  notifications: {
    email: boolean
    sms: boolean
    campaignUpdates: boolean
    deliveryReports: boolean
    systemAlerts: boolean
  }
  security: {
    twoFactor: boolean
    sessionTimeout: number
  }
  billing: {
    plan: string
    balance: number
    autoRecharge: boolean
    rechargeAmount: number
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    company: '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      campaignUpdates: true,
      deliveryReports: true,
      systemAlerts: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30
    },
    billing: {
      plan: 'basic',
      balance: 0,
      autoRecharge: false,
      rechargeAmount: 50
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockSettings: UserSettings = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Example Company',
        phone: '+1234567890',
        timezone: 'America/New_York',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          campaignUpdates: true,
          deliveryReports: true,
          systemAlerts: true
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30
        },
        billing: {
          plan: 'basic',
          balance: 100.50,
          autoRecharge: false,
          rechargeAmount: 50
        }
      }
      setSettings(mockSettings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      // Implement save functionality
      console.log('Saving settings:', settings)
      // await api.put('/settings', settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev }
      const keys = path.split('.')
      let current: any = newSettings
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and configuration</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSetting('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => updateSetting('company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateSetting('phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about your campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSetting('notifications.email', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => updateSetting('notifications.sms', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="campaign-updates">Campaign Updates</Label>
                    <p className="text-sm text-gray-600">Get notified when campaigns are completed</p>
                  </div>
                  <Switch
                    id="campaign-updates"
                    checked={settings.notifications.campaignUpdates}
                    onCheckedChange={(checked) => updateSetting('notifications.campaignUpdates', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="delivery-reports">Delivery Reports</Label>
                    <p className="text-sm text-gray-600">Receive detailed delivery reports</p>
                  </div>
                  <Switch
                    id="delivery-reports"
                    checked={settings.notifications.deliveryReports}
                    onCheckedChange={(checked) => updateSetting('notifications.deliveryReports', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-alerts">System Alerts</Label>
                    <p className="text-sm text-gray-600">Important system notifications</p>
                  </div>
                  <Switch
                    id="system-alerts"
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications.systemAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) => updateSetting('security.twoFactor', checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select 
                    value={settings.security.sessionTimeout.toString()} 
                    onValueChange={(value) => updateSetting('security.sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your billing information and subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Current Plan</Label>
                    <p className="text-sm text-gray-600 capitalize">{settings.billing.plan} Plan</p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Account Balance</Label>
                    <p className="text-sm text-gray-600">${settings.billing.balance.toFixed(2)}</p>
                  </div>
                  <Button variant="outline">Add Funds</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-recharge">Auto Recharge</Label>
                    <p className="text-sm text-gray-600">Automatically add funds when balance is low</p>
                  </div>
                  <Switch
                    id="auto-recharge"
                    checked={settings.billing.autoRecharge}
                    onCheckedChange={(checked) => updateSetting('billing.autoRecharge', checked)}
                  />
                </div>
                {settings.billing.autoRecharge && (
                  <div>
                    <Label htmlFor="recharge-amount">Recharge Amount</Label>
                    <Input
                      id="recharge-amount"
                      type="number"
                      value={settings.billing.rechargeAmount}
                      onChange={(e) => updateSetting('billing.rechargeAmount', parseFloat(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
              <CardDescription>Configure your SMS sending preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="default-sender">Default Sender ID</Label>
                  <Input
                    id="default-sender"
                    placeholder="YourCompany"
                    maxLength={11}
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum 11 characters</p>
                </div>
                <div>
                  <Label htmlFor="message-template">Default Message Template</Label>
                  <Textarea
                    id="message-template"
                    placeholder="Enter your default message template..."
                    rows={4}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="unicode-support">Unicode Support</Label>
                    <p className="text-sm text-gray-600">Enable support for special characters and emojis</p>
                  </div>
                  <Switch id="unicode-support" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
