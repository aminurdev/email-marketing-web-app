'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  Database,
  Mail,
  ExternalLink
} from 'lucide-react';

const securityFeatures = [
  {
    title: 'App Password Authentication',
    icon: Key,
    description: 'Uses Gmail App Passwords instead of regular passwords for secure authentication',
    implementation: 'All Gmail configurations use 16-character app passwords with encryption at rest'
  },
  {
    title: 'Password Encryption',
    icon: Lock,
    description: 'All stored passwords are encrypted using industry-standard encryption',
    implementation: 'AES-256 encryption for all sensitive data with secure key management'
  },
  {
    title: 'Rate Limiting',
    icon: Shield,
    description: 'Respects Gmail daily limits to prevent account suspension',
    implementation: 'Automatic rate limiting with configurable daily send limits per account'
  },
  {
    title: 'Data Validation',
    icon: Database,
    description: 'All input data is validated and sanitized before processing',
    implementation: 'Server-side validation for all API endpoints with type checking'
  }
];

const bestPractices = [
  {
    category: 'Gmail Account Security',
    icon: Mail,
    practices: [
      'Enable 2-Factor Authentication on all Gmail accounts',
      'Use unique App Passwords for each application',
      'Regularly rotate App Passwords (every 6 months)',
      'Monitor Gmail account activity for suspicious logins',
      'Use strong, unique passwords for Gmail accounts'
    ]
  },
  {
    category: 'Email List Management',
    icon: Database,
    practices: [
      'Only import users who have given explicit consent',
      'Regularly clean your email lists to remove inactive addresses',
      'Implement proper unsubscribe mechanisms',
      'Respect bounce notifications and remove invalid addresses',
      'Segment lists to avoid sending irrelevant content'
    ]
  },
  {
    category: 'Sending Practices',
    icon: Shield,
    practices: [
      'Start with small volumes and gradually increase',
      'Maintain consistent sending patterns',
      'Use professional, non-spammy content',
      'Include proper sender identification',
      'Monitor delivery rates and reputation'
    ]
  }
];

export default function SecurityPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Security & Privacy</h1>
          <p className="text-muted-foreground mt-1">
            How we protect your data and ensure secure email sending
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">Security Priorities:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Secure authentication with Gmail App Passwords</li>
              <li>• Encryption of all sensitive data at rest</li>
              <li>• Rate limiting to protect account reputation</li>
              <li>• Input validation and sanitization</li>
              <li>• Privacy-focused data handling</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Security Features */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            Built-in Security Features
          </CardTitle>
          <CardDescription className="text-base">
            Security measures implemented to protect your data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-xs text-muted-foreground">
                    <strong>Implementation:</strong> {feature.implementation}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gmail Security */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Key className="h-4 w-4 text-white" />
            </div>
            Gmail Security Setup
          </CardTitle>
          <CardDescription className="text-base">
            Secure your Gmail accounts for email sending
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Why App Passwords?</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>More Secure:</strong> App passwords are application-specific and can be revoked individually</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>No Main Password:</strong> Your main Gmail password stays private</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Easy Management:</strong> Can be disabled without affecting other apps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Required by Google:</strong> Third-party apps must use app passwords</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Security Checklist</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>2FA enabled on Gmail account</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Unique app password generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>App password stored securely</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Regular security monitoring</span>
                </div>
              </div>
              <Link href="/docs/gmail-setup">
                <Button className="w-full mt-3" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Gmail Setup Guide
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      {bestPractices.map((category, categoryIndex) => {
        const Icon = category.icon;
        const colorClasses = [
          'from-blue-50/50 to-purple-50/50 border-blue-100',
          'from-green-50/50 to-emerald-50/50 border-green-100',
          'from-orange-50/50 to-red-50/50 border-orange-100'
        ];

        return (
          <Card key={categoryIndex} className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${colorClasses[categoryIndex]} border-b`}>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {category.practices.map((practice, practiceIndex) => (
                  <li key={practiceIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{practice}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}

      {/* Data Privacy */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            Data Privacy & Compliance
          </CardTitle>
          <CardDescription className="text-base">
            How we handle and protect your data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Data We Store</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">User Information</p>
                  <p className="text-xs text-muted-foreground">Names, email addresses, categories (with consent)</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Gmail Configurations</p>
                  <p className="text-xs text-muted-foreground">Account names, emails, encrypted app passwords</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Email Logs</p>
                  <p className="text-xs text-muted-foreground">Delivery status, timestamps, performance metrics</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Campaign Data</p>
                  <p className="text-xs text-muted-foreground">Email content, recipient lists, scheduling info</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Privacy Principles</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Minimal Data:</strong> We only store what's necessary for functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Encryption:</strong> All sensitive data is encrypted at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>No Sharing:</strong> Your data is never shared with third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>User Control:</strong> You can delete your data at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Consent-Based:</strong> Only email users who have opted in</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Warnings */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50/50 to-pink-50/50 border-b border-red-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            Security Warnings
          </CardTitle>
          <CardDescription className="text-base">
            Important security considerations and warnings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <p className="font-medium mb-1">Never Share App Passwords</p>
                <p className="text-sm">App passwords provide full access to your Gmail account. Never share them or store them in unsecured locations.</p>
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <p className="font-medium mb-1">Monitor Account Activity</p>
                <p className="text-sm">Regularly check your Gmail account for suspicious activity. Revoke app passwords if you suspect unauthorized access.</p>
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <p className="font-medium mb-1">Respect Email Laws</p>
                <p className="text-sm">Ensure compliance with CAN-SPAM, GDPR, and other email marketing regulations in your jurisdiction.</p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Additional Security Resources</h3>
            <p className="text-muted-foreground">
              Learn more about email security and best practices
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://support.google.com/accounts/answer/185833" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                <ExternalLink className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Google App Passwords</h4>
                <p className="text-sm text-muted-foreground">
                  Official Google documentation
                </p>
              </div>
            </a>
            <Link href="/docs/gmail-setup">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                <Key className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Setup Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Step-by-step security setup
                </p>
              </div>
            </Link>
            <Link href="/docs/best-practices">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Best Practices</h4>
                <p className="text-sm text-muted-foreground">
                  Email marketing guidelines
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}