const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    is_active: true,
    balance: 1000.0,
    company: 'SMS Platform Inc',
    phone: '+1234567890',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'client1@example.com',
    name: 'John Smith',
    role: 'client',
    is_active: true,
    balance: 500.0,
    company: 'Tech Solutions Inc',
    phone: '+1234567891',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const contacts = [
  {
    id: 1,
    name: 'Alice Brown',
    phone: '+1234567001',
    email: 'alice@example.com',
    user_id: 2,
    group_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Bob Davis',
    phone: '+1234567002',
    email: 'bob@example.com',
    user_id: 2,
    group_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const contactGroups = [
  {
    id: 1,
    name: 'VIP Customers',
    description: 'High-value customers',
    user_id: 2,
    contact_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const campaigns = [
  {
    id: 1,
    name: 'Holiday Sale Campaign',
    message: '🎄 Holiday Sale! Get 30% off everything. Shop now!',
    user_id: 2,
    status: 'sent',
    total_recipients: 100,
    delivered_count: 95,
    failed_count: 5,
    sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const templates = [
  {
    id: 1,
    name: 'Welcome Message',
    content: 'Welcome to our service! We\'re excited to have you on board.',
    user_id: 2,
    is_approved: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Auth endpoints
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (user && password === 'admin123' || password === 'password123') {
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken: 'mock-jwt-token-' + user.id
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.get('/auth/me', (req, res) => {
  res.json({
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    is_active: true,
    balance: 1000.0,
    company: 'SMS Platform Inc',
    phone: '+1234567890',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// Dashboard endpoints
app.get('/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      total_campaigns: 5,
      total_messages: 1000,
      delivered_messages: 950,
      failed_messages: 50,
      pending_messages: 0,
      total_contacts: 25,
      total_groups: 3,
      balance: 1000.0
    }
  });
});

// Contacts endpoints
app.get('/contacts/', (req, res) => {
  res.json(contacts);
});

app.post('/contacts/', (req, res) => {
  const newContact = {
    id: contacts.length + 1,
    ...req.body,
    user_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  contacts.push(newContact);
  res.json(newContact);
});

app.get('/contacts/groups/', (req, res) => {
  res.json(contactGroups);
});

app.post('/contacts/groups/', (req, res) => {
  const newGroup = {
    id: contactGroups.length + 1,
    ...req.body,
    user_id: 2,
    contact_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  contactGroups.push(newGroup);
  res.json(newGroup);
});

// Campaigns endpoints
app.get('/campaigns/', (req, res) => {
  res.json(campaigns);
});

app.post('/campaigns/', (req, res) => {
  const newCampaign = {
    id: campaigns.length + 1,
    ...req.body,
    user_id: 2,
    status: 'draft',
    total_recipients: 0,
    delivered_count: 0,
    failed_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  campaigns.push(newCampaign);
  res.json(newCampaign);
});

// Templates endpoints
app.get('/templates/', (req, res) => {
  res.json(templates);
});

app.post('/templates/', (req, res) => {
  const newTemplate = {
    id: templates.length + 1,
    ...req.body,
    user_id: 2,
    is_approved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  templates.push(newTemplate);
  res.json(newTemplate);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'SMS Marketing Platform API (Mock)', 
    version: '1.0.0',
    endpoints: [
      'POST /auth/login',
      'GET /auth/me',
      'GET /dashboard/stats',
      'GET /contacts/',
      'POST /contacts/',
      'GET /contacts/groups/',
      'POST /contacts/groups/',
      'GET /campaigns/',
      'POST /campaigns/',
      'GET /templates/',
      'POST /templates/'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Backend API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🔑 Test Login: admin@example.com / admin123`);
});
