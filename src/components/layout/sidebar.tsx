'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Send,
  BarChart3,
  UserCheck,
  Shield,
  Building,
  CreditCard,
  Server,
  TestTube,
  ClipboardList
} from 'lucide-react'

const clientNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Quick SMS', href: '/dashboard/quick-sms', icon: Send },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: MessageSquare },
  { name: 'A/B Testing', href: '/dashboard/ab-testing', icon: TestTube },
  { name: 'Surveys', href: '/dashboard/surveys', icon: ClipboardList },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Contact Groups', href: '/dashboard/contact-groups', icon: UserCheck },
  { name: 'Templates', href: '/dashboard/templates', icon: FileText },
  { name: 'Sender IDs', href: '/dashboard/sender-ids', icon: UserCheck },
  { name: 'Automation', href: '/dashboard/automation', icon: Settings },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Segmentation', href: '/dashboard/segmentation', icon: Users },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Campaigns', href: '/admin/campaigns', icon: MessageSquare },
  { name: 'Sender IDs', href: '/admin/sender-ids', icon: UserCheck },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Vendors', href: '/admin/vendors', icon: Building },
  { name: 'API Status', href: '/admin/api-status', icon: Server },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])
  
  const navItems = user?.role === 'admin' ? adminNavItems : clientNavItems

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold text-white">SMS Platform</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
