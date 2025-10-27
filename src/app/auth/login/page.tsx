'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '@/hooks/use-api'
import { debugLogin } from '@/lib/debug-api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Use debug function to see what's happening
      const data = await debugLogin(email, password)
      
      // Store user data in localStorage for simplicity
      localStorage.setItem('user', JSON.stringify({
        email: email,
        name: email.split('@')[0], // Simple name extraction
        role: email.includes('admin') ? 'admin' : 'client'
      }))
      localStorage.setItem('token', data.access_token)

      if (email.includes('admin')) {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      alert('Login failed: ' + (error.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
            
            <div className="text-center text-sm text-gray-600">
              <p>Don't have an account? </p>
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
                Create one here
              </Link>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Demo Credentials:</p>
              <p>Admin: admin@example.com / admin123</p>
              <p>Client: client1@example.com / password123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
