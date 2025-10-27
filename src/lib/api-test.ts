// API Integration Test Suite
import { apiService } from './api-service'

export class ApiIntegrationTest {
  private testResults: Array<{ test: string; status: 'pass' | 'fail'; error?: string }> = []

  async runAllTests() {
    console.log('🧪 Starting API Integration Tests...')
    
    await this.testAuth()
    await this.testContacts()
    await this.testCampaigns()
    await this.testTemplates()
    await this.testBilling()
    await this.testAutomation()
    await this.testAdmin()
    
    this.printResults()
    return this.testResults
  }

  private async testAuth() {
    try {
      // Test login
      const loginResult = await apiService.login('admin@example.com', 'admin123')
      if (loginResult.access_token) {
        this.addResult('Auth Login', 'pass')
      } else {
        this.addResult('Auth Login', 'fail', 'No access token returned')
      }
    } catch (error: any) {
      this.addResult('Auth Login', 'fail', error.message)
    }

    try {
      // Test current user
      const user = await apiService.getCurrentUser()
      if (user.id && user.email) {
        this.addResult('Get Current User', 'pass')
      } else {
        this.addResult('Get Current User', 'fail', 'Invalid user data')
      }
    } catch (error: any) {
      this.addResult('Get Current User', 'fail', error.message)
    }
  }

  private async testContacts() {
    try {
      // Test get contacts
      const contacts = await apiService.getContacts(0, 10)
      if (Array.isArray(contacts)) {
        this.addResult('Get Contacts', 'pass')
      } else {
        this.addResult('Get Contacts', 'fail', 'Invalid contacts data')
      }
    } catch (error: any) {
      this.addResult('Get Contacts', 'fail', error.message)
    }

    try {
      // Test create contact
      const newContact = await apiService.createContact({
        name: 'Test Contact',
        phone: '+1234567890',
        email: 'test@example.com',
        is_active: true
      })
      if (newContact.id) {
        this.addResult('Create Contact', 'pass')
        
        // Clean up
        await apiService.deleteContact(newContact.id)
      } else {
        this.addResult('Create Contact', 'fail', 'No ID returned')
      }
    } catch (error: any) {
      this.addResult('Create Contact', 'fail', error.message)
    }

    try {
      // Test contact groups
      const groups = await apiService.getContactGroups()
      if (Array.isArray(groups)) {
        this.addResult('Get Contact Groups', 'pass')
      } else {
        this.addResult('Get Contact Groups', 'fail', 'Invalid groups data')
      }
    } catch (error: any) {
      this.addResult('Get Contact Groups', 'fail', error.message)
    }
  }

  private async testCampaigns() {
    try {
      // Test get campaigns
      const campaigns = await apiService.getCampaigns(0, 10)
      if (Array.isArray(campaigns)) {
        this.addResult('Get Campaigns', 'pass')
      } else {
        this.addResult('Get Campaigns', 'fail', 'Invalid campaigns data')
      }
    } catch (error: any) {
      this.addResult('Get Campaigns', 'fail', error.message)
    }

    try {
      // Test create campaign
      const newCampaign = await apiService.createCampaign({
        name: 'Test Campaign',
        message: 'Test message',
        status: 'draft',
        total_recipients: 0
      })
      if (newCampaign.id) {
        this.addResult('Create Campaign', 'pass')
        
        // Clean up
        await apiService.deleteCampaign(newCampaign.id)
      } else {
        this.addResult('Create Campaign', 'fail', 'No ID returned')
      }
    } catch (error: any) {
      this.addResult('Create Campaign', 'fail', error.message)
    }
  }

  private async testTemplates() {
    try {
      // Test get templates
      const templates = await apiService.getTemplates(0, 10)
      if (Array.isArray(templates)) {
        this.addResult('Get Templates', 'pass')
      } else {
        this.addResult('Get Templates', 'fail', 'Invalid templates data')
      }
    } catch (error: any) {
      this.addResult('Get Templates', 'fail', error.message)
    }

    try {
      // Test create template
      const newTemplate = await apiService.createTemplate({
        name: 'Test Template',
        content: 'Test template content',
        category: 'marketing'
      })
      if (newTemplate.id) {
        this.addResult('Create Template', 'pass')
        
        // Clean up
        await apiService.deleteTemplate(newTemplate.id)
      } else {
        this.addResult('Create Template', 'fail', 'No ID returned')
      }
    } catch (error: any) {
      this.addResult('Create Template', 'fail', error.message)
    }
  }

  private async testBilling() {
    try {
      // Test billing stats
      const stats = await apiService.getBillingStats()
      if (typeof stats.current_balance === 'number') {
        this.addResult('Get Billing Stats', 'pass')
      } else {
        this.addResult('Get Billing Stats', 'fail', 'Invalid billing stats')
      }
    } catch (error: any) {
      this.addResult('Get Billing Stats', 'fail', error.message)
    }

    try {
      // Test transactions
      const transactions = await apiService.getTransactions(0, 10)
      if (Array.isArray(transactions)) {
        this.addResult('Get Transactions', 'pass')
      } else {
        this.addResult('Get Transactions', 'fail', 'Invalid transactions data')
      }
    } catch (error: any) {
      this.addResult('Get Transactions', 'fail', error.message)
    }
  }

  private async testAutomation() {
    try {
      // Test automation workflows
      const workflows = await apiService.getAutomationWorkflows()
      if (Array.isArray(workflows)) {
        this.addResult('Get Automation Workflows', 'pass')
      } else {
        this.addResult('Get Automation Workflows', 'fail', 'Invalid workflows data')
      }
    } catch (error: any) {
      this.addResult('Get Automation Workflows', 'fail', error.message)
    }

    try {
      // Test keyword triggers
      const triggers = await apiService.getKeywordTriggers()
      if (Array.isArray(triggers)) {
        this.addResult('Get Keyword Triggers', 'pass')
      } else {
        this.addResult('Get Keyword Triggers', 'fail', 'Invalid triggers data')
      }
    } catch (error: any) {
      this.addResult('Get Keyword Triggers', 'fail', error.message)
    }

    try {
      // Test drip campaigns
      const campaigns = await apiService.getDripCampaigns()
      if (Array.isArray(campaigns)) {
        this.addResult('Get Drip Campaigns', 'pass')
      } else {
        this.addResult('Get Drip Campaigns', 'fail', 'Invalid campaigns data')
      }
    } catch (error: any) {
      this.addResult('Get Drip Campaigns', 'fail', error.message)
    }
  }

  private async testAdmin() {
    try {
      // Test admin dashboard stats
      const stats = await apiService.getAdminDashboardStats()
      if (typeof stats.total_users === 'number') {
        this.addResult('Get Admin Dashboard Stats', 'pass')
      } else {
        this.addResult('Get Admin Dashboard Stats', 'fail', 'Invalid admin stats')
      }
    } catch (error: any) {
      this.addResult('Get Admin Dashboard Stats', 'fail', error.message)
    }

    try {
      // Test admin users
      const users = await apiService.getAdminUsers(0, 10)
      if (Array.isArray(users)) {
        this.addResult('Get Admin Users', 'pass')
      } else {
        this.addResult('Get Admin Users', 'fail', 'Invalid users data')
      }
    } catch (error: any) {
      this.addResult('Get Admin Users', 'fail', error.message)
    }

    try {
      // Test admin vendors
      const vendors = await apiService.getAdminVendors()
      if (Array.isArray(vendors)) {
        this.addResult('Get Admin Vendors', 'pass')
      } else {
        this.addResult('Get Admin Vendors', 'fail', 'Invalid vendors data')
      }
    } catch (error: any) {
      this.addResult('Get Admin Vendors', 'fail', error.message)
    }
  }

  private addResult(test: string, status: 'pass' | 'fail', error?: string) {
    this.testResults.push({ test, status, error })
  }

  private printResults() {
    console.log('\n📊 API Integration Test Results:')
    console.log('================================')
    
    const passed = this.testResults.filter(r => r.status === 'pass').length
    const failed = this.testResults.filter(r => r.status === 'fail').length
    
    this.testResults.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : '❌'
      console.log(`${icon} ${result.test}`)
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
    })
    
    console.log('\n📈 Summary:')
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📊 Total: ${this.testResults.length}`)
    console.log(`🎯 Success Rate: ${Math.round((passed / this.testResults.length) * 100)}%`)
  }
}

// Export for use in components
export const runApiTests = async () => {
  const tester = new ApiIntegrationTest()
  return await tester.runAllTests()
}
