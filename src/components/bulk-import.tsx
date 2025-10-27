'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface BulkImportProps {
  onImportComplete?: () => void
}

export default function BulkImport({ onImportComplete }: BulkImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [importResults, setImportResults] = useState<any>(null)
  const [isImporting, setIsImporting] = useState(false)
  const queryClient = useQueryClient()

  const importMutation = useMutation(
    async (formData: FormData) => {
      const response = await api.post('/contacts/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    {
      onSuccess: (data) => {
        setImportResults(data)
        queryClient.invalidateQueries('contacts')
        onImportComplete?.()
      },
      onError: (error) => {
        console.error('Import error:', error)
        alert('Failed to import contacts. Please check your file format.')
      }
    }
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImportResults(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsImporting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await importMutation.mutateAsync(formData)
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = 'name,phone,email,group_name\nJohn Doe,+1234567890,john@example.com,VIP Customers\nJane Smith,+1987654321,jane@example.com,Newsletter Subscribers'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Contacts</DialogTitle>
          <DialogDescription>
            Import multiple contacts from a CSV file. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Step 1: Download Template</CardTitle>
              <CardDescription>
                Download the CSV template to see the required format for importing contacts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={downloadTemplate} className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Step 2: Upload CSV File</CardTitle>
              <CardDescription>
                Select your CSV file with contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">CSV File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                </div>
                {file && (
                  <div className="text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Import Results */}
          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Import Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Successfully imported: {importResults.successful || 0} contacts
                  </div>
                  {importResults.failed > 0 && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Failed to import: {importResults.failed || 0} contacts
                    </div>
                  )}
                  {importResults.errors && importResults.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Errors:</h4>
                      <div className="max-h-32 overflow-y-auto text-xs text-red-600">
                        {importResults.errors.map((error: string, index: number) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || isImporting}
              className="min-w-[100px]"
            >
              {isImporting ? 'Importing...' : 'Import Contacts'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
