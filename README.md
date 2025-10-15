# Email Campaign Manager

A professional email sending system built with Next.js, Nodemailer, and MongoDB. Send bulk emails through multiple Gmail configurations with robust user management and campaign tracking.

## Features

### 🚀 Core Features
- **Multiple Gmail Configurations**: Add and manage multiple Gmail accounts for sending
- **User Management**: Import users from CSV files with categories and tags
- **Bulk Email Sending**: Send campaigns to all users or specific categories
- **Rate Limiting**: Built-in daily limits and rate limiting to prevent spam
- **Campaign Scheduling**: Schedule emails for future delivery
- **Professional Dashboard**: Clean, responsive interface for managing everything

### 📧 Email Features
- HTML and text email support
- Template personalization
- Delivery tracking and logging
- Failed email handling
- Gmail App Password integration

### 👥 User Management
- CSV import with automatic parsing
- User categorization and tagging
- Search and filter capabilities
- Bulk operations

### 📊 Analytics & Monitoring
- Daily sending limits tracking
- Campaign success/failure rates
- User engagement metrics
- Real-time sending progress

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Gmail accounts with App Passwords enabled

### Installation

1. **Clone and install dependencies**
```bash
git clone <your-repo>
cd email-campaign-manager
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/email-campaign-manager
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000` - you'll be redirected to the dashboard.

## Gmail Setup

### Enable App Passwords
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this App Password (not your regular password) in the Gmail configuration

### Add Gmail Configuration
1. Go to Dashboard → Gmail Configurations
2. Click "Add Configuration"
3. Enter:
   - **Name**: Descriptive name (e.g., "Marketing Gmail")
   - **Email**: Your Gmail address
   - **App Password**: The 16-character password from Google
   - **Daily Limit**: Max emails per day (recommended: 500)
4. **Test Configuration**: Click "Test" button and enter your email to verify setup

## User Management

### CSV Import Format
Your CSV file should have these columns (simplified format):
```csv
name,email
John Doe,john@example.com
Jane Smith,jane@example.com
```

### Import Process
1. Go to Dashboard → User Management
2. Click "Upload CSV"
3. **Select a category** for all users in the CSV
4. Select your CSV file (name,email format)
5. Review the import results

## Sending Campaigns

### Create a Campaign
1. Go to Dashboard → Email Campaigns
2. Fill in campaign details:
   - **Campaign Name**: Internal reference
   - **Gmail Configuration**: Which account to send from
   - **Subject**: Email subject line
   - **HTML Content**: Your email content (HTML supported)
   - **Text Content**: Plain text version (optional)
   - **Recipients**: Choose categories or all users
   - **Schedule**: Send now or schedule for later

### Best Practices
- Test with a small group first
- Keep daily limits reasonable (500-1000 emails)
- Use multiple Gmail accounts for larger campaigns
- Include unsubscribe links in your emails
- Monitor delivery rates and adjust accordingly

## API Endpoints

### Gmail Configurations
- `GET /api/gmail-configs` - List all configurations
- `POST /api/gmail-configs` - Create new configuration
- `PUT /api/gmail-configs/[id]` - Update configuration
- `DELETE /api/gmail-configs/[id]` - Delete configuration

### Users
- `GET /api/users` - List users with pagination and filters
- `POST /api/users` - Create single user
- `POST /api/users/upload-csv` - Bulk import from CSV

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category

### Email Campaigns
- `POST /api/emails/send` - Send or schedule campaign

## Database Schema

### Collections
- **gmailconfigs**: Gmail account configurations
- **useremails**: User email addresses and metadata
- **categories**: User categorization
- **emailcampaigns**: Campaign definitions and status
- **emaillogs**: Delivery tracking (future enhancement)

## Security Features

- Password hashing for Gmail app passwords
- Rate limiting to prevent abuse
- Input validation and sanitization
- MongoDB injection protection
- CORS configuration

## Production Deployment

### Environment Setup
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Set up proper CORS and security headers
4. Configure rate limiting based on your needs

### Scaling Considerations
- Use MongoDB replica sets for high availability
- Implement Redis for session management
- Add email queue system for large campaigns
- Monitor Gmail API limits and rotate accounts

## Troubleshooting

### Common Issues

**Gmail Authentication Fails**
- Ensure 2FA is enabled on Gmail account
- Use App Password, not regular password
- Use the test email feature to verify configuration
- Check that "Less secure app access" is not blocking

**CSV Import Fails**
- Verify CSV format matches expected columns
- Check for special characters in email addresses
- Ensure file size is reasonable (<10MB)

**Emails Not Sending**
- Check Gmail configuration is active
- Verify daily limits haven't been exceeded
- Check MongoDB connection
- Review server logs for detailed errors

### Support
For issues and questions, check the logs in your browser console and server terminal. Most issues are related to:
1. MongoDB connection
2. Gmail authentication
3. CSV format problems

## License

MIT License - feel free to use this for your projects!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using Next.js, MongoDB, and Nodemailer