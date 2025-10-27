'use client'

import { useQuery } from 'react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { DashboardStats } from '@/types'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { 
  MessageSquare, 
  Users, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign
} from 'lucide-react'

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>(
    'dashboard-stats',
    async () => {
      const response = await api.get('/dashboard/stats')
      return response.data
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Campaigns',
      value: formatNumber(stats?.totalCampaigns || 0),
      description: 'All time campaigns',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      title: 'Total Messages',
      value: formatNumber(stats?.totalMessages || 0),
      description: 'Messages sent',
      icon: Send,
      color: 'text-green-600',
    },
    {
      title: 'Delivered',
      value: formatNumber(stats?.deliveredMessages || 0),
      description: 'Successfully delivered',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Failed',
      value: formatNumber(stats?.failedMessages || 0),
      description: 'Failed deliveries',
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      title: 'Pending',
      value: formatNumber(stats?.pendingMessages || 0),
      description: 'Awaiting delivery',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Total Contacts',
      value: formatNumber(stats?.totalContacts || 0),
      description: 'Contact database',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Contact Groups',
      value: formatNumber(stats?.totalGroups || 0),
      description: 'Organized groups',
      icon: Users,
      color: 'text-indigo-600',
    },
    {
      title: 'Account Balance',
      value: formatCurrency(stats?.balance || 0),
      description: 'Available credits',
      icon: DollarSign,
      color: 'text-emerald-600',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your SMS marketing activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest SMS campaigns and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Campaign "Holiday Sale" completed</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New contact group created</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Template "Welcome Message" approved</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Send className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium">Send Quick SMS</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-sm font-medium">Create Campaign</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium">Add Contacts</p>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle className="h-6 w-6 text-indigo-600 mb-2" />
                <p className="text-sm font-medium">View Reports</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
