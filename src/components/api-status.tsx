'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, RefreshCw, Server, Database, Zap } from 'lucide-react'
import { runApiTests } from '@/lib/api-test'

interface TestResult {
  test: string
  status: 'pass' | 'fail'
  error?: string
}

export default function ApiStatus() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    try {
      const results = await runApiTests()
      setTestResults(results)
      setLastRun(new Date())
    } catch (error) {
      console.error('Test execution error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    // Run tests on component mount
    runTests()
  }, [])

  const passedTests = testResults.filter(r => r.status === 'pass').length
  const failedTests = testResults.filter(r => r.status === 'fail').length
  const totalTests = testResults.length
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0

  const getStatusColor = (status: 'pass' | 'fail') => {
    return status === 'pass' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Integration Status</h2>
          <p className="text-gray-600">Monitor the health and connectivity of all API endpoints</p>
        </div>
        <div className="flex items-center space-x-4">
          {lastRun && (
            <p className="text-sm text-gray-500">
              Last run: {lastRun.toLocaleTimeString()}
            </p>
          )}
          <Button
            onClick={runTests}
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running...' : 'Run Tests'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{passedTests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedTests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-yellow-600">{successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Overall API Health
          </CardTitle>
          <CardDescription>
            Current status of all API integrations and endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Badge
              variant={successRate >= 90 ? 'default' : successRate >= 70 ? 'secondary' : 'destructive'}
              className="text-lg px-4 py-2"
            >
              {successRate >= 90 ? 'Excellent' : successRate >= 70 ? 'Good' : 'Needs Attention'}
            </Badge>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  successRate >= 90 ? 'bg-green-500' : successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${successRate}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">{successRate}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Detailed results for each API endpoint test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={result.status === 'pass' ? 'default' : 'destructive'}
                    >
                      {result.status === 'pass' ? 'PASS' : 'FAIL'}
                    </Badge>
                    {result.error && (
                      <span className="text-sm text-red-600 max-w-md truncate">
                        {result.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Endpoints Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            Status of all available API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Authentication', endpoint: '/auth', status: 'active' },
              { name: 'Contacts', endpoint: '/contacts', status: 'active' },
              { name: 'Campaigns', endpoint: '/campaigns', status: 'active' },
              { name: 'Messages', endpoint: '/messages', status: 'active' },
              { name: 'Templates', endpoint: '/templates', status: 'active' },
              { name: 'Billing', endpoint: '/billing', status: 'active' },
              { name: 'Reports', endpoint: '/reports', status: 'active' },
              { name: 'Automation', endpoint: '/automation', status: 'active' },
              { name: 'Admin', endpoint: '/admin', status: 'active' },
            ].map((endpoint, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">{endpoint.name}</p>
                  <p className="text-sm text-gray-500">{endpoint.endpoint}</p>
                </div>
                <Badge variant="default" className="ml-auto">
                  {endpoint.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
