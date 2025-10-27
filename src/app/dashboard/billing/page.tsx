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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, DollarSign, Download, Plus, Settings, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

interface BillingInfo {
  balance: number
  plan: string
  autoRecharge: boolean
  rechargeAmount: number
  rechargeThreshold: number
  paymentMethod: string
  nextBillingDate: string
}

interface Transaction {
  id: number
  date: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed'
}

interface UsageStats {
  messagesSent: number
  messagesCost: number
  currentMonthUsage: number
  projectedMonthlyCost: number
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    balance: 100.50,
    plan: 'basic',
    autoRecharge: false,
    rechargeAmount: 50,
    rechargeThreshold: 10,
    paymentMethod: '**** 1234',
    nextBillingDate: '2024-02-15'
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats>({
    messagesSent: 15420,
    messagesCost: 154.20,
    currentMonthUsage: 3200,
    projectedMonthlyCost: 32.00
  })
  const [loading, setLoading] = useState(true)
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState(50)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      // Fetch transactions
      const transactionsResponse = await api.get('/billing/transactions')
      setTransactions(transactionsResponse.data)
      
      // Fetch billing stats
      const statsResponse = await api.get('/billing/stats')
      setBillingInfo(statsResponse.data)
    } catch (error) {
      console.error('Error fetching billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecharge = async () => {
    try {
      await api.post('/billing/transactions', { 
        amount: rechargeAmount, 
        type: 'credit', 
        description: 'Account Recharge' 
      })
      setIsRechargeDialogOpen(false)
      fetchBillingData()
    } catch (error) {
      console.error('Error processing recharge:', error)
    }
  }

  const handleAutoRechargeToggle = async (enabled: boolean) => {
    try {
      // await api.put('/billing/auto-recharge', { enabled })
      setBillingInfo(prev => ({ ...prev, autoRecharge: enabled }))
    } catch (error) {
      console.error('Error updating auto recharge:', error)
    }
  }

  const downloadInvoice = (transactionId: number) => {
    // Implement invoice download
    console.log('Downloading invoice for transaction:', transactionId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-gray-600">Manage your account balance and payment settings</p>
        </div>
        <Dialog open={isRechargeDialogOpen} onOpenChange={setIsRechargeDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Funds to Account</DialogTitle>
              <DialogDescription>
                Add funds to your account to continue sending SMS messages
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsRechargeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecharge}>
                  Add Funds
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${billingInfo.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Available for SMS campaigns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{billingInfo.plan}</div>
                <p className="text-xs text-muted-foreground">
                  $0.01 per SMS message
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageStats.messagesSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${usageStats.projectedMonthlyCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Projected this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common billing tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Payment Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto Recharge</CardTitle>
                <CardDescription>Automatically add funds when balance is low</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enable Auto Recharge</span>
                  <Switch
                    checked={billingInfo.autoRecharge}
                    onCheckedChange={handleAutoRechargeToggle}
                  />
                </div>
                {billingInfo.autoRecharge && (
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm">Recharge Amount</Label>
                      <p className="text-sm text-gray-600">${billingInfo.rechargeAmount}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Threshold</Label>
                      <p className="text-sm text-gray-600">When balance falls below ${billingInfo.rechargeThreshold}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your account transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadInvoice(transaction.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Month Usage</CardTitle>
                <CardDescription>Your SMS usage for this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Messages Sent</span>
                  <span className="font-semibold">{usageStats.currentMonthUsage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Cost</span>
                  <span className="font-semibold">${usageStats.messagesCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Rate per SMS</span>
                  <span className="font-semibold">$0.01</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Projections</CardTitle>
                <CardDescription>Estimated costs based on current usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Projected Monthly Cost</span>
                  <span className="font-semibold">${usageStats.projectedMonthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Days Remaining</span>
                  <span className="font-semibold">15 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estimated Total</span>
                  <span className="font-semibold">${(usageStats.projectedMonthlyCost * 1.5).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage your payment methods and billing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-gray-600">{billingInfo.paymentMethod}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Update Payment Method
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">Billing Address</Label>
                  <p className="text-sm text-gray-600">123 Main St, City, State 12345</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Update Address
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Billing Date</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(billingInfo.nextBillingDate).toLocaleDateString()}
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
