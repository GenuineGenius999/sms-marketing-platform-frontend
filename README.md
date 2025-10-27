# SMS Marketing Platform

A comprehensive SMS marketing and bulk messaging platform built with Next.js and Python FastAPI.

## Features

### For Clients
- **Dashboard**: Overview of campaigns, messages, and performance metrics
- **Quick SMS**: Send instant SMS messages to multiple recipients
- **Campaign Management**: Create, schedule, and monitor SMS campaigns
- **Contact Management**: Organize contacts into groups for targeted messaging
- **Template System**: Create and manage reusable SMS message templates
- **File Upload**: Import contacts from CSV/TXT files
- **Reporting**: Track delivery status and campaign performance
- **Account Management**: Balance tracking and settings

### For Administrators
- **Client Management**: Oversee all client accounts and activities
- **Sender ID Approval**: Review and approve sender ID requests
- **Template Review**: Approve or reject SMS templates
- **Campaign Monitoring**: Monitor all campaigns across the platform
- **Vendor Management**: Configure SMS service providers
- **System Settings**: Platform configuration and management
- **Analytics**: Platform-wide statistics and insights

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **React Query**: Data fetching and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Lucide React**: Icon library

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: Python SQL toolkit and ORM
- **JWT**: JSON Web Tokens for authentication
- **Pydantic**: Data validation using Python type annotations
- **Celery**: Distributed task queue for background processing
- **Redis**: In-memory data structure store
- **httpx**: Async HTTP client for external API calls

## Project Structure

```
sms-marketing-platform/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages
│   │   ├── auth/                 # Authentication pages
│   │   ├── dashboard/            # Client dashboard
│   │   └── admin/                # Admin dashboard
│   ├── components/               # React components
│   │   ├── ui/                   # UI components
│   │   └── layout/               # Layout components
│   ├── lib/                      # Utilities and configurations
│   └── types/                    # TypeScript type definitions
├── backend/                       # Python FastAPI backend
│   ├── app/
│   │   ├── core/                 # Core configurations
│   │   ├── models/               # Database models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── routers/              # API routes
│   │   ├── services/             # Business logic
│   │   └── tasks/                # Celery tasks
│   └── requirements.txt          # Python dependencies
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 12+
- Redis 6+

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   # Create PostgreSQL database
   createdb sms_platform
   
   # Run the application (creates tables automatically)
   python main.py
   ```

5. **Start Celery worker** (in separate terminal)
   ```bash
   celery -A app.tasks.sms_tasks worker --loglevel=info
   ```

6. **Start Celery beat** (in separate terminal)
   ```bash
   celery -A app.tasks.sms_tasks beat --loglevel=info
   ```

## Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/sms_platform

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# SMS Vendor Settings
SMS_VENDOR_URL=https://api.smsvendor.com
SMS_VENDOR_API_KEY=your-sms-vendor-api-key

# Redis (for Celery)
REDIS_URL=redis://localhost:6379

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Key Features Implementation

### Authentication
- JWT-based authentication with role-based access control
- Secure password hashing with bcrypt
- Session management with automatic token refresh

### SMS Sending
- Integration with SMS service providers
- Bulk message processing with rate limiting
- Delivery status tracking and reporting
- Background task processing with Celery

### Contact Management
- CSV/TXT file import with validation
- Contact grouping and organization
- Duplicate detection and handling
- Bulk operations support

### Campaign Management
- Campaign creation and scheduling
- Template-based messaging
- Real-time status updates
- Performance analytics

### Admin Features
- Multi-tenant user management
- Content approval workflows
- System monitoring and health checks
- Vendor configuration management

## Development

### Running Tests
```bash
# Frontend tests
npm run test

# Backend tests
cd backend
pytest
```

### Code Formatting
```bash
# Frontend
npm run lint
npm run format

# Backend
black .
isort .
```

### Database Migrations
```bash
# If using Alembic (optional)
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

### Backend (Docker)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Database
- Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Configure connection pooling
- Set up automated backups

### Redis
- Use managed Redis service (AWS ElastiCache, Google Cloud Memorystore, etc.)
- Configure persistence if needed

## Security Considerations

- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- SQL injection prevention with SQLAlchemy ORM
- XSS protection with React
- CSRF protection
- Secure file upload handling
- Environment variable security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API docs at `/docs`

## Roadmap

- [ ] Advanced analytics and reporting
- [ ] A/B testing for campaigns
- [ ] Webhook integrations
- [ ] Mobile app
- [ ] Advanced scheduling options
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced user permissions
- [ ] White-label customization
- [ ] Integration marketplace
