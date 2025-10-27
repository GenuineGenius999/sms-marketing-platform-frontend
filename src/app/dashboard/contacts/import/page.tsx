'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { Upload, FileText, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
}

export default function ImportContactsPage() {
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const queryClient = useQueryClient()

  const importContactsMutation = useMutation(
    async (contacts: any[]) => {
      const response = await api.post('/contacts/import', { contacts })
      return response.data
    },
    {
      onSuccess: (data) => {
        setImportResult(data)
        queryClient.invalidateQueries('contacts')
      },
      onError: (error) => {
        setImportResult({
          success: false,
          imported: 0,
          errors: ['Failed to import contacts. Please try again.']
        })
      }
    }
  )

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    setImportResult(null)

    try {
      const text = await file.text()
      const results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.toLowerCase().trim()
      })

      if (results.errors.length > 0) {
        setImportResult({
          success: false,
          imported: 0,
          errors: results.errors.map(error => error.message)
        })
        return
      }

      // Validate and transform data
      const contacts = results.data.map((row: any, index: number) => {
        const errors: string[] = []
        
        if (!row.name || !row.phone) {
          errors.push(`Row ${index + 1}: Name and phone are required`)
        }
        
        if (row.phone && !/^\+?[\d\s\-\(\)]+$/.test(row.phone)) {
          errors.push(`Row ${index + 1}: Invalid phone number format`)
        }
        
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          errors.push(`Row ${index + 1}: Invalid email format`)
        }

        return {
          name: row.name?.trim(),
          phone: row.phone?.trim(),
          email: row.email?.trim() || null,
          group_id: row.group_id ? parseInt(row.group_id) : null,
          errors
        }
      })

      const validContacts = contacts.filter(contact => contact.errors.length === 0)
      const invalidContacts = contacts.filter(contact => contact.errors.length > 0)

      if (invalidContacts.length > 0) {
        setImportResult({
          success: false,
          imported: 0,
          errors: invalidContacts.flatMap(contact => contact.errors)
        })
        return
      }

      if (validContacts.length === 0) {
        setImportResult({
          success: false,
          imported: 0,
          errors: ['No valid contacts found in the file']
        })
        return
      }

      importContactsMutation.mutate(validContacts)
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Failed to process file. Please check the format.']
      })
    } finally {
      setIsProcessing(false)
    }
  }, [importContactsMutation])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Import Contacts</h1>
        <p className="text-gray-600">Upload a CSV or TXT file to import contacts in bulk</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Drag and drop your file here, or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium text-blue-600">Drop the file here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Choose a file or drag it here
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports CSV, TXT, XLS, XLSX files
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Format Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>File Format</CardTitle>
            <CardDescription>
              Your file should contain the following columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <code className="bg-gray-100 px-1 rounded">name</code> - Contact's full name</li>
                  <li>• <code className="bg-gray-100 px-1 rounded">phone</code> - Phone number (include country code)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Optional Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <code className="bg-gray-100 px-1 rounded">email</code> - Email address</li>
                  <li>• <code className="bg-gray-100 px-1 rounded">group_id</code> - Contact group ID</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Example CSV:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`name,phone,email,group_id
John Doe,+1234567890,john@example.com,1
Jane Smith,+0987654321,jane@example.com,2
Bob Johnson,+1122334455,,`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Status */}
        {isProcessing && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg font-medium">Processing file...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {importResult.success ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">
                      Successfully imported {importResult.imported} contacts
                    </span>
                  </div>
                  <Button 
                    onClick={() => {
                      setImportResult(null)
                      queryClient.invalidateQueries('contacts')
                    }}
                    className="w-full"
                  >
                    View Contacts
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Import failed</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Errors:</h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setImportResult(null)}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Include country code in phone numbers (e.g., +1 for US)</li>
              <li>• Use consistent formatting for phone numbers</li>
              <li>• Check that email addresses are valid</li>
              <li>• Group IDs must exist in your contact groups</li>
              <li>• Large files may take a few minutes to process</li>
              <li>• Duplicate phone numbers will be skipped</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
