'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  CheckCircle,
  Settings,
  Users,
  Send,
  AlertCircle,
  ExternalLink,
  Play,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Configure Gmail Account',
    description: 'Set up your Gmail account with app password for secure sending',
    icon: Settings,
    time: '3 minutes',
    details: [
      'Enable 2-Factor Authentication on your Gmail account',
      'Generate an App Password from Google Account settings',
      'Add your Gmail configuration in the dashboard',
      'Test the connection to ensure it works'
    ]
  },
  {
    number: 2,
    title: 'Import Your Users',
    description: 'Add recipients either individually or via CSV upload',
    icon: Users,
    time: '2 minutes',
    details: [
      'Create categories to organize your recipients',
      'Add users individually through the form',
      'Or upload a CSV file with name and email columns',
      'Review and verify imported users'
    ]
  },
  {
    number: 3,
    title: 'Create Your First Campaign',
    description: 'Design and send your first professional email campaign',
    icon: Send,
    time: '5 minutes',
    details: [
      'Write compelling subject line and email content',
      'Select your target audience from categories',
      'Preview your email across different devices',
      'Send immediately or schedule for later'
    ]
  }
];

export default function GettingStartedPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Getting Started</h1>
          <p className="text-muted-foreground mt-1">
            Set up your email campaign manager in just a few minutes
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <Play className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">What you'll accomplish:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Set up your first Gmail configuration</li>
              <li>• Import users and organize them into categories</li>
              <li>• Create and send your first email campaign</li>
              <li>• Monitor campaign performance and delivery</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Prerequisites */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-7 h-7 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            Prerequisites
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Gmail Account</p>
                <p className="text-sm text-muted-foreground">
                  A Gmail account with 2-Factor Authentication enabled
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">User List</p>
                <p className="text-sm text-muted-foreground">
                  A list of email recipients (CSV file or individual entries)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Email Content</p>
                <p className="text-sm text-muted-foreground">
                  Your email content ready to send (HTML or plain text)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-step Guide */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={step.number} className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>
                    {step.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {step.time}
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      Steps to Complete
                    </h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      {step.number === 1 && (
                        <>
                          <Link href="/dashboard/gmail-configs">
                            <Button size="sm" className="w-full justify-start">
                              <Settings className="h-4 w-4 mr-2" />
                              Go to Gmail Configs
                            </Button>
                          </Link>
                          <a 
                            href="https://myaccount.google.com/apppasswords" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Generate App Password
                            </Button>
                          </a>
                        </>
                      )}
                      {step.number === 2 && (
                        <>
                          <Link href="/dashboard/users">
                            <Button size="sm" className="w-full justify-start">
                              <Users className="h-4 w-4 mr-2" />
                              Manage Users
                            </Button>
                          </Link>
                          <Link href="/dashboard/categories">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Users className="h-4 w-4 mr-2" />
                              Create Categories
                            </Button>
                          </Link>
                        </>
                      )}
                      {step.number === 3 && (
                        <>
                          <Link href="/dashboard/campaigns">
                            <Button size="sm" className="w-full justify-start">
                              <Send className="h-4 w-4 mr-2" />
                              Create Campaign
                            </Button>
                          </Link>
                          <Link href="/dashboard/email-history">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              View Email History
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-7 h-7 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
            What's Next?
          </CardTitle>
          <CardDescription>
            Continue learning with these advanced guides
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/gmail-setup">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-semibold mb-1">Advanced Gmail Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Learn about daily limits, multiple accounts, and troubleshooting
                </p>
              </div>
            </Link>
            <Link href="/docs/campaigns">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-semibold mb-1">Campaign Best Practices</h4>
                <p className="text-sm text-muted-foreground">
                  Tips for creating effective email campaigns that get results
                </p>
              </div>
            </Link>
            <Link href="/docs/user-management">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-semibold mb-1">Advanced User Management</h4>
                <p className="text-sm text-muted-foreground">
                  Organize users with categories and manage large lists efficiently
                </p>
              </div>
            </Link>
            <Link href="/docs/email-tracking">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-semibold mb-1">Email Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Track opens, clicks, and campaign performance metrics
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}