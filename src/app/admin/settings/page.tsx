'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Bell,
  Globe,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { api } from '@/lib/api'

interface PlatformSettings {
  // General Settings
  platform_name: string
  platform_url: string
  support_email: string
  support_phone: string
  timezone: string
  currency: string
  
  // SMS Settings
  default_sms_provider: string
  max_message_length: number
  rate_limit_per_minute: number
  rate_limit_per_hour: number
  rate_limit_per_day: number
  
  // Security Settings
  require_2fa: boolean
  session_timeout: number
  password_min_length: number
  max_login_attempts: number
  lockout_duration: number
  
  // Notification Settings
  email_notifications: boolean
  sms_notifications: boolean
  webhook_notifications: boolean
  notification_email: string
  
  // Billing Settings
  sms_cost_per_message: number
  minimum_balance: number
  auto_recharge_enabled: boolean
  auto_recharge_threshold: number
  auto_recharge_amount: number
  
  // Database Settings
  backup_frequency: string
  backup_retention_days: number
  log_retention_days: number
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    platform_name: 'SMS Marketing Platform',
    platform_url: 'https://sms-platform.com',
    support_email: 'support@sms-platform.com',
    support_phone: '+1-555-0123',
    timezone: 'UTC',
    currency: 'USD',
    default_sms_provider: 'twilio',
    max_message_length: 160,
    rate_limit_per_minute: 10,
    rate_limit_per_hour: 100,
    rate_limit_per_day: 1000,
    require_2fa: false,
    session_timeout: 30,
    password_min_length: 8,
    max_login_attempts: 5,
    lockout_duration: 15,
    email_notifications: true,
    sms_notifications: true,
    webhook_notifications: false,
    notification_email: 'admin@sms-platform.com',
    sms_cost_per_message: 0.01,
    minimum_balance: 10.00,
    auto_recharge_enabled: false,
    auto_recharge_threshold: 5.00,
    auto_recharge_amount: 50.00,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    log_retention_days: 90
  })
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // Mock data for now - in real app this would be an API call
      // const response = await api.get('/admin/settings')
      // setSettings(response.data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      // In real app, this would be an API call
      // await api.put('/admin/settings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
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
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">Settings saved successfully!</span>
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic platform configuration and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform_name">Platform Name</Label>
                  <Input
                    id="platform_name"
                    value={settings.platform_name}
                    onChange={(e) => handleSettingChange('platform_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="platform_url">Platform URL</Label>
                  <Input
                    id="platform_url"
                    value={settings.platform_url}
                    onChange={(e) => handleSettingChange('platform_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="support_email">Support Email</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => handleSettingChange('support_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="support_phone">Support Phone</Label>
                  <Input
                    id="support_phone"
                    value={settings.support_phone}
                    onChange={(e) => handleSettingChange('support_phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SMS Configuration
              </CardTitle>
              <CardDescription>
                SMS service settings and rate limiting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default_sms_provider">Default SMS Provider</Label>
                  <Select value={settings.default_sms_provider} onValueChange={(value) => handleSettingChange('default_sms_provider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws_sns">AWS SNS</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                      <SelectItem value="mock">Mock (Development)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max_message_length">Max Message Length</Label>
                  <Input
                    id="max_message_length"
                    type="number"
                    value={settings.max_message_length}
                    onChange={(e) => handleSettingChange('max_message_length', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="rate_limit_per_minute">Rate Limit (per minute)</Label>
                  <Input
                    id="rate_limit_per_minute"
                    type="number"
                    value={settings.rate_limit_per_minute}
                    onChange={(e) => handleSettingChange('rate_limit_per_minute', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="rate_limit_per_hour">Rate Limit (per hour)</Label>
                  <Input
                    id="rate_limit_per_hour"
                    type="number"
                    value={settings.rate_limit_per_hour}
                    onChange={(e) => handleSettingChange('rate_limit_per_hour', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="rate_limit_per_day">Rate Limit (per day)</Label>
                  <Input
                    id="rate_limit_per_day"
                    type="number"
                    value={settings.rate_limit_per_day}
                    onChange={(e) => handleSettingChange('rate_limit_per_day', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Authentication and security configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require_2fa">Require Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Force all users to enable 2FA</p>
                </div>
                <Switch
                  id="require_2fa"
                  checked={settings.require_2fa}
                  onCheckedChange={(checked) => handleSettingChange('require_2fa', checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="password_min_length">Minimum Password Length</Label>
                  <Input
                    id="password_min_length"
                    type="number"
                    value={settings.password_min_length}
                    onChange={(e) => handleSettingChange('password_min_length', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => handleSettingChange('max_login_attempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockout_duration"
                    type="number"
                    value={settings.lockout_duration}
                    onChange={(e) => handleSettingChange('lockout_duration', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Send notifications via email</p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Send notifications via SMS</p>
                </div>
                <Switch
                  id="sms_notifications"
                  checked={settings.sms_notifications}
                  onCheckedChange={(checked) => handleSettingChange('sms_notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="webhook_notifications">Webhook Notifications</Label>
                  <p className="text-sm text-gray-600">Send notifications via webhooks</p>
                </div>
                <Switch
                  id="webhook_notifications"
                  checked={settings.webhook_notifications}
                  onCheckedChange={(checked) => handleSettingChange('webhook_notifications', checked)}
                />
              </div>
              <div>
                <Label htmlFor="notification_email">Notification Email</Label>
                <Input
                  id="notification_email"
                  type="email"
                  value={settings.notification_email}
                  onChange={(e) => handleSettingChange('notification_email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Billing Settings
              </CardTitle>
              <CardDescription>
                Configure billing and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sms_cost_per_message">SMS Cost per Message</Label>
                  <Input
                    id="sms_cost_per_message"
                    type="number"
                    step="0.0001"
                    value={settings.sms_cost_per_message}
                    onChange={(e) => handleSettingChange('sms_cost_per_message', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_balance">Minimum Balance</Label>
                  <Input
                    id="minimum_balance"
                    type="number"
                    step="0.01"
                    value={settings.minimum_balance}
                    onChange={(e) => handleSettingChange('minimum_balance', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_recharge_enabled">Auto-Recharge Enabled</Label>
                  <p className="text-sm text-gray-600">Automatically recharge user balances</p>
                </div>
                <Switch
                  id="auto_recharge_enabled"
                  checked={settings.auto_recharge_enabled}
                  onCheckedChange={(checked) => handleSettingChange('auto_recharge_enabled', checked)}
                />
              </div>
              {settings.auto_recharge_enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="auto_recharge_threshold">Recharge Threshold</Label>
                    <Input
                      id="auto_recharge_threshold"
                      type="number"
                      step="0.01"
                      value={settings.auto_recharge_threshold}
                      onChange={(e) => handleSettingChange('auto_recharge_threshold', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="auto_recharge_amount">Recharge Amount</Label>
                    <Input
                      id="auto_recharge_amount"
                      type="number"
                      step="0.01"
                      value={settings.auto_recharge_amount}
                      onChange={(e) => handleSettingChange('auto_recharge_amount', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Database and system maintenance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backup_frequency">Backup Frequency</Label>
                  <Select value={settings.backup_frequency} onValueChange={(value) => handleSettingChange('backup_frequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backup_retention_days">Backup Retention (days)</Label>
                  <Input
                    id="backup_retention_days"
                    type="number"
                    value={settings.backup_retention_days}
                    onChange={(e) => handleSettingChange('backup_retention_days', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="log_retention_days">Log Retention (days)</Label>
                  <Input
                    id="log_retention_days"
                    type="number"
                    value={settings.log_retention_days}
                    onChange={(e) => handleSettingChange('log_retention_days', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">System Maintenance</p>
                  <p className="text-sm text-yellow-700">
                    Changes to backup and log retention settings will take effect on the next scheduled maintenance window.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
