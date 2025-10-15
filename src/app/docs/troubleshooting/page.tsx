'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Mail,
  Users,
  Clock,
  Shield,
  ExternalLink
} from 'lucide-react';

const commonIssues = [
  {
    category: 'Gmail Configuration',
    icon: Settings,
    color: 'red',
    issues: [
      {
        problem: '"Username and Password not accepted"',
        cause: 'Using regular Gmail password instead of App Password',
        solutions: [
          'Ensure 2-Factor Authentication is enabled on your Gmail account',
          'Generate a new App Password from Google Account settings',
          'Use the 16-character App Password, not your regular password',
          'Remove all spaces from the App Password when entering it'
        ]
      },
      {
        problem: 'Gmail configuration test fails',
        cause: 'Network or authentication issues',
        solutions: [
          'Check your internet connection',
          'Verify the Gmail account is accessible',
          'Try generating a new App Password',
          'Make sure the Gmail account has 2FA enabled'
        ]
      }
    ]
  },
  {
    category: 'Email Sending',
    icon: Mail,
    color: 'yellow',
    issues: [
      {
        problem: '"Daily limit exceeded"',
        cause: 'Reached Gmail\'s daily sending limit',
        solutions: [
          'Wait until the next day (limits reset at midnight GMT)',
          'Add additional Gmail accounts to increase capacity',
          'Lower your daily limit setting to avoid hitting restrictions',
          'Spread campaigns across multiple days'
        ]
      },
      {
        problem: 'Emails going to spam',
        cause: 'Content or sending patterns triggering spam filters',
        solutions: [
          'Avoid spam trigger words in subject and content',
          'Include a proper unsubscribe link',
          'Send from a consistent Gmail address',
          'Start with smaller volumes and gradually increase'
        ]
      }
    ]
  },
  {
    category: 'User Management',
    icon: Users,
    color: 'blue',
    issues: [
      {
        problem: 'CSV upload fails',
        cause: 'Incorrect file format or structure',
        solutions: [
          'Ensure CSV has exactly 2 columns: name,email',
          'First row must be headers',
          'Check for special characters or encoding issues',
          'Download and use the provided CSV template'
        ]
      },
      {
        problem: 'Users not appearing in campaigns',
        cause: 'Category mismatch or inactive users',
        solutions: [
          'Verify users are in the correct category',
          'Check that users are marked as active',
          'Refresh the campaign recipient selection',
          'Ensure the category exists and has users'
        ]
      }
    ]
  }
];

export default function TroubleshootingPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Troubleshooting Guide</h1>
          <p className="text-muted-foreground mt-1">
            Common issues and their solutions
          </p>
        </div>
      </div>

      {/* Quick Help */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">Need immediate help?</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Check the status indicators in your dashboard</li>
              <li>• Review error messages carefully - they often contain the solution</li>
              <li>• Try the test functions to isolate the problem</li>
              <li>• Start with the most recent changes you made</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Common Issues */}
      {commonIssues.map((category, categoryIndex) => {
        const Icon = category.icon;
        const colorClasses = {
          red: 'from-red-50/50 to-pink-50/50 border-red-100',
          yellow: 'from-yellow-50/50 to-orange-50/50 border-yellow-100',
          blue: 'from-blue-50/50 to-purple-50/50 border-blue-100'
        };

        return (
          <Card key={categoryIndex} className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} border-b`}>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {category.category} Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {category.issues.map((issue, issueIndex) => (
                  <div key={issueIndex} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800">{issue.problem}</h4>
                        <p className="text-sm text-red-600 mt-1">{issue.cause}</p>
                      </div>
                    </div>
                    <div className="ml-8">
                      <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Solutions:
                      </h5>
                      <ul className="space-y-1">
                        {issue.solutions.map((solution, solutionIndex) => (
                          <li key={solutionIndex} className="text-sm text-green-700 flex items-start gap-2">
                            <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* System Status Indicators */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            Understanding Status Indicators
          </CardTitle>
          <CardDescription className="text-base">
            Learn what the different status indicators mean
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Gmail Configuration Status</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Active</p>
                    <p className="text-xs text-muted-foreground">Configuration is working and can send emails</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Inactive</p>
                    <p className="text-xs text-muted-foreground">Configuration is disabled or has issues</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Error</p>
                    <p className="text-xs text-muted-foreground">Authentication or connection problems</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Campaign Status</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Draft</p>
                    <p className="text-xs text-muted-foreground">Campaign is being created or edited</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Scheduled</p>
                    <p className="text-xs text-muted-foreground">Campaign is scheduled for future sending</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-sm">Sending</p>
                    <p className="text-xs text-muted-foreground">Campaign is currently being sent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Completed</p>
                    <p className="text-xs text-muted-foreground">Campaign has been sent successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Issues */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            Performance & Speed Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Slow Campaign Sending</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>This is normal - we respect Gmail's rate limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Large campaigns may take several hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Add more Gmail accounts for faster sending</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Monitor progress in Email History</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Dashboard Loading Slowly</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clear your browser cache and cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check your internet connection speed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Try using a different browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Large user lists may take time to load</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting More Help */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Still Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              If you can't find the solution here, try these additional resources.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/docs/gmail-setup">
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Settings className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Gmail Setup Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed Gmail configuration instructions
                  </p>
                </div>
              </Link>
              <a 
                href="https://support.google.com/accounts/answer/185833" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <ExternalLink className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Google Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Official Google App Password help
                  </p>
                </div>
              </a>
              <Link href="/docs/best-practices">
                <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Best Practices</h4>
                  <p className="text-sm text-muted-foreground">
                    Tips for successful email campaigns
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}