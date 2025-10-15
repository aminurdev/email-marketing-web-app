"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Mail,
  Key,
  Clock,
  Users,
} from "lucide-react";

export default function GmailSetupPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">
            Gmail Setup Guide
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure Gmail accounts securely for email campaigns
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="space-y-2">
            <p className="font-medium">Important Security Notice</p>
            <p className="text-sm">
              Never use your regular Gmail password. Always use App Passwords
              for third-party applications. This guide will show you how to set
              this up securely.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Step 1: Enable 2FA */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            Enable Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-base">
            2FA is required before you can generate App Passwords
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Steps to Enable 2FA
              </h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Go to your <strong>Google Account settings</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Click on <strong>"Security"</strong> in the left sidebar
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Under "Signing in to Google", click{" "}
                    <strong>"2-Step Verification"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Follow the setup wizard to enable 2FA</span>
                </li>
              </ol>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quick Link</h4>
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google Account Security
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                This will open in a new tab
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Generate App Password */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            Generate App Password
          </CardTitle>
          <CardDescription className="text-base">
            Create a secure password specifically for the email campaign manager
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Key className="h-5 w-5 text-green-600" />
                Generate Your App Password
              </h4>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Go to <strong>Google App Passwords</strong> page
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Select <strong>"Mail"</strong> as the app
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Choose your device or enter a custom name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Click <strong>"Generate"</strong> and copy the 16-character
                    password
                  </span>
                </li>
              </ol>

              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <Key className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <p className="font-medium mb-1">App Password Format</p>
                  <p className="text-sm">
                    The password will look like:{" "}
                    <code className="bg-white px-1 rounded">
                      abcd efgh ijkl mnop
                    </code>
                  </p>
                  <p className="text-xs mt-1">
                    You can remove the spaces when entering it in our system.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quick Link</h4>
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Generate App Password
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Requires 2FA to be enabled first
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Add to System */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            Add Gmail Configuration
          </CardTitle>
          <CardDescription className="text-base">
            Enter your Gmail details in the email campaign manager
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Configuration Fields
              </h4>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Name</p>
                  <p className="text-xs text-muted-foreground">
                    A friendly name for this configuration (e.g., "Marketing
                    Gmail")
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-xs text-muted-foreground">
                    Your Gmail address (e.g., your-email@gmail.com)
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">App Password</p>
                  <p className="text-xs text-muted-foreground">
                    The 16-character password from step 2 (spaces will be
                    removed automatically)
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Daily Limit</p>
                  <p className="text-xs text-muted-foreground">
                    Maximum emails per day (recommended: 500 or less)
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Add Configuration</h4>
              <Link href="/dashboard/gmail-configs">
                <Button className="w-full justify-start mb-3">
                  <Settings className="h-4 w-4 mr-2" />
                  Go to Gmail Configurations
                </Button>
              </Link>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Test your configuration after adding it</p>
                <p>• You can add multiple Gmail accounts</p>
                <p>• Each account has its own daily limit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Limits & Best Practices */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            Daily Limits & Best Practices
          </CardTitle>
          <CardDescription className="text-base">
            Important guidelines for sending emails safely
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Recommended Daily Limits</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-green-800">New Account</p>
                    <p className="text-xs text-green-600">First 30 days</p>
                  </div>
                  <Badge className="bg-green-600">100-200/day</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-blue-800">
                      Established Account
                    </p>
                    <p className="text-xs text-blue-600">After 30 days</p>
                  </div>
                  <Badge className="bg-blue-600">300-500/day</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <p className="font-medium text-purple-800">High Volume</p>
                    <p className="text-xs text-purple-600">Trusted accounts</p>
                  </div>
                  <Badge className="bg-purple-600">500-1000/day</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Best Practices</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Start with lower limits and gradually increase</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use multiple Gmail accounts for higher volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Monitor delivery rates and adjust accordingly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Always test with a small group first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep your email content professional</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50/50 to-pink-50/50 border-b border-red-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-1">
                "Username and Password not accepted"
              </h4>
              <p className="text-sm text-red-700 mb-2">
                This usually means you're using your regular Gmail password
                instead of an App Password.
              </p>
              <ul className="text-xs text-red-600 space-y-1 ml-4">
                <li>• Make sure 2FA is enabled on your Gmail account</li>
                <li>
                  • Use the 16-character App Password, not your regular password
                </li>
                <li>• Try generating a new App Password</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold text-yellow-800 mb-1">
                "Daily limit exceeded"
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                You've reached your daily sending limit for this Gmail account.
              </p>
              <ul className="text-xs text-yellow-600 space-y-1 ml-4">
                <li>
                  • Wait until the next day (limits reset at midnight GMT)
                </li>
                <li>• Add additional Gmail accounts to increase capacity</li>
                <li>
                  • Lower your daily limit to avoid hitting Gmail's restrictions
                </li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-1">
                "Connection timeout"
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                Network or server connectivity issues.
              </p>
              <ul className="text-xs text-blue-600 space-y-1 ml-4">
                <li>• Check your internet connection</li>
                <li>• Try testing the configuration again</li>
                <li>• Verify your Gmail account is accessible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Send Emails?</h3>
          <p className="text-muted-foreground mb-6">
            Now that your Gmail is configured, you can start importing users and
            creating campaigns.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/docs/user-management">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Import Users
              </Button>
            </Link>
            <Link href="/docs/campaigns">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
