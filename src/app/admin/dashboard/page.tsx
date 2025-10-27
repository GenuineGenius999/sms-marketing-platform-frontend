'use client'

import { useQuery } from 'react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { 
  Users, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Building,
  Shield
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery(
    'admin-dashboard-stats',
    async () => {
      const response = await api.get('/admin/dashboard/stats')
      return response.data
    },
    {
      refetchInterval: 30000,
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
      title: 'Total Clients',
      value: formatNumber(stats?.totalClients || 0),
      description: 'Registered users',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Campaigns',
      value: formatNumber(stats?.activeCampaigns || 0),
      description: 'Currently running',
      icon: MessageSquare,
      color: 'text-green-600',
    },
    {
      title: 'Messages Sent',
      value: formatNumber(stats?.totalMessages || 0),
      description: 'All time messages',
      icon: Send,
      color: 'text-purple-600',
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate || 0}%`,
      description: 'Delivery success',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Failed Messages',
      value: formatNumber(stats?.failedMessages || 0),
      description: 'Delivery failures',
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats?.revenue || 0),
      description: 'Total earnings',
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Pending Approvals',
      value: formatNumber(stats?.pendingApprovals || 0),
      description: 'Awaiting review',
      icon: Shield,
      color: 'text-yellow-600',
    },
    {
      title: 'Vendor Status',
      value: stats?.vendorStatus || 'Unknown',
      description: 'SMS provider status',
      icon: Building,
      color: 'text-indigo-600',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
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
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New client registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Template approved</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sender ID pending approval</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Campaign failed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database</span>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">SMS Gateway</span>
                <span className="text-sm text-green-600">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Redis Cache</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-blue-600">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Queue Status</span>
                <span className="text-sm text-green-600">Processing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
