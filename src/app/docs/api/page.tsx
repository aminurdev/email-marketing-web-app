'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  Code,
  Key,
  Shield,
  Database,
  Send,
  Users,
  Settings,
  Mail,
  Copy
} from 'lucide-react';

const endpoints = [
  {
    category: 'Users',
    icon: Users,
    color: 'blue',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users',
        description: 'Fetch users with filtering and pagination',
        params: ['page', 'limit', 'category', 'search'],
        response: 'Array of user objects with pagination info'
      },
      {
        method: 'POST',
        path: '/api/users',
        description: 'Create a new user',
        body: ['email', 'firstName', 'lastName', 'category'],
        response: 'Created user object'
      },
      {
        method: 'POST',
        path: '/api/users/upload-csv',
        description: 'Bulk import users from CSV file',
        body: ['file (FormData)', 'category'],
        response: 'Import results with processed/skipped counts'
      }
    ]
  },
  {
    category: 'Campaigns',
    icon: Send,
    color: 'green',
    endpoints: [
      {
        method: 'GET',
        path: '/api/campaigns',
        description: 'List all campaigns with optional filtering',
        params: ['status', 'search'],
        response: 'Array of campaign objects'
      },
      {
        method: 'POST',
        path: '/api/campaigns',
        description: 'Create a new email campaign',
        body: ['name', 'subject', 'htmlContent', 'textContent', 'recipients', 'gmailConfigId'],
        response: 'Created campaign object with recipient count'
      },
      {
        method: 'GET',
        path: '/api/campaigns/[id]',
        description: 'Get specific campaign details',
        params: ['id (path parameter)'],
        response: 'Campaign object with full details'
      },
      {
        method: 'PUT',
        path: '/api/campaigns/[id]',
        description: 'Update an existing campaign',
        body: ['name', 'subject', 'htmlContent', 'textContent', 'recipients'],
        response: 'Updated campaign object'
      },
      {
        method: 'POST',
        path: '/api/campaigns/[id]/send',
        description: 'Send or schedule a campaign',
        body: ['scheduleAt (optional)'],
        response: 'Send confirmation with recipient count'
      }
    ]
  },
  {
    category: 'Gmail Configs',
    icon: Settings,
    color: 'purple',
    endpoints: [
      {
        method: 'GET',
        path: '/api/gmail-configs',
        description: 'List all Gmail configurations',
        params: [],
        response: 'Array of Gmail config objects (passwords excluded)'
      },
      {
        method: 'POST',
        path: '/api/gmail-configs',
        description: 'Add a new Gmail configuration',
        body: ['name', 'email', 'password', 'dailyLimit'],
        response: 'Created Gmail config object'
      },
      {
        method: 'PUT',
        path: '/api/gmail-configs/[id]',
        description: 'Update Gmail configuration settings',
        body: ['name', 'dailyLimit', 'isActive'],
        response: 'Updated Gmail config object'
      },
      {
        method: 'POST',
        path: '/api/gmail-configs/[id]/test',
        description: 'Test Gmail configuration with a test email',
        body: ['testEmail'],
        response: 'Test result confirmation'
      }
    ]
  },
  {
    category: 'Email History',
    icon: Mail,
    color: 'orange',
    endpoints: [
      {
        method: 'GET',
        path: '/api/email-history',
        description: 'Fetch email logs with filtering and pagination',
        params: ['page', 'limit', 'status', 'category', 'search', 'dateFrom', 'dateTo'],
        response: 'Array of email log objects with statistics'
      }
    ]
  },
  {
    category: 'Categories',
    icon: Database,
    color: 'indigo',
    endpoints: [
      {
        method: 'GET',
        path: '/api/categories',
        description: 'List all user categories',
        params: [],
        response: 'Array of category objects with user counts'
      },
      {
        method: 'POST',
        path: '/api/categories',
        description: 'Create a new user category',
        body: ['name', 'description', 'color'],
        response: 'Created category object'
      }
    ]
  }
];

export default function ApiPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/docs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Docs
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
          <p className="text-muted-foreground mt-1">
            Complete REST API documentation for developers
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <Code className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">API Features:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• RESTful endpoints with JSON responses</li>
              <li>• Comprehensive error handling and validation</li>
              <li>• Pagination support for large datasets</li>
              <li>• Filtering and search capabilities</li>
              <li>• Secure authentication and data handling</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Base URL */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
            Base URL & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Base URL</h4>
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg font-mono text-sm">
                <span>https://your-domain.com</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('https://your-domain.com')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Content Type</h4>
              <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm">
                Content-Type: application/json
              </div>
            </div>
            <Alert className="bg-yellow-50 border-yellow-200">
              <Shield className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <p className="font-medium mb-1">Authentication</p>
                <p className="text-sm">Currently, the API runs in the same session as the web application. Future versions will include API key authentication for external access.</p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      {endpoints.map((category, categoryIndex) => {
        const Icon = category.icon;
        const colorClasses = {
          blue: 'from-blue-50/50 to-purple-50/50 border-blue-100',
          green: 'from-green-50/50 to-emerald-50/50 border-green-100',
          purple: 'from-purple-50/50 to-pink-50/50 border-purple-100',
          orange: 'from-orange-50/50 to-red-50/50 border-orange-100',
          indigo: 'from-indigo-50/50 to-blue-50/50 border-indigo-100'
        };

        return (
          <Card key={categoryIndex} className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} border-b`}>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {category.category} API
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {category.endpoints.map((endpoint, endpointIndex) => (
                  <div key={endpointIndex} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                        className="font-mono text-xs"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {endpoint.params && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">Query Parameters</h5>
                          <ul className="text-xs space-y-1">
                            {endpoint.params.map((param, paramIndex) => (
                              <li key={paramIndex} className="font-mono bg-gray-50 px-2 py-1 rounded">
                                {param}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {endpoint.body && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">Request Body</h5>
                          <ul className="text-xs space-y-1">
                            {endpoint.body.map((field, fieldIndex) => (
                              <li key={fieldIndex} className="font-mono bg-gray-50 px-2 py-1 rounded">
                                {field}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-2">Response</h5>
                      <p className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        {endpoint.response}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Response Format */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
            Response Format
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Success Response</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm font-mono text-green-800">
{`{
  "success": true,
  "data": [...], // Response data
  "pagination": { // For paginated endpoints
    "page": 1,
    "limit": 50,
    "total": 1234,
    "pages": 25
  }
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Error Response</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm font-mono text-red-800">
{`{
  "success": false,
  "error": "Error message describing what went wrong"
}`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HTTP Status Codes */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            HTTP Status Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-3 text-green-800">Success Codes</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <code className="font-mono text-sm">200</code>
                  <span className="text-sm">OK - Request successful</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <code className="font-mono text-sm">201</code>
                  <span className="text-sm">Created - Resource created</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-800">Error Codes</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <code className="font-mono text-sm">400</code>
                  <span className="text-sm">Bad Request - Invalid data</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <code className="font-mono text-sm">404</code>
                  <span className="text-sm">Not Found - Resource not found</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <code className="font-mono text-sm">409</code>
                  <span className="text-sm">Conflict - Duplicate resource</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <code className="font-mono text-sm">500</code>
                  <span className="text-sm">Server Error - Internal error</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Usage */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
            Example Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">JavaScript/Fetch Example</h4>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono">
{`// Create a new user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    category: 'Newsletter'
  })
});

const result = await response.json();
if (result.success) {
  console.log('User created:', result.data);
} else {
  console.error('Error:', result.error);
}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">cURL Example</h4>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono">
{`curl -X POST https://your-domain.com/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "category": "Newsletter"
  }'`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Integrate?</h3>
          <p className="text-muted-foreground mb-6">
            Start building with our API to create custom email marketing solutions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/docs/getting-started">
              <Button>
                <Key className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/docs/troubleshooting">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Troubleshooting
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}