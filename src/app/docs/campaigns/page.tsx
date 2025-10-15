'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  Send,
  Edit,
  Eye,
  Calendar,
  Users,
  Mail,
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

export default function CampaignsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Create, design, and send professional email campaigns
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <Send className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">Campaign Features:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Rich HTML email editor with preview</li>
              <li>• Target specific user categories</li>
              <li>• Schedule campaigns for later sending</li>
              <li>• Track delivery, opens, and clicks</li>
              <li>• Duplicate successful campaigns</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Creating Campaigns */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Edit className="h-4 w-4 text-white" />
            </div>
            Creating Your Campaign
          </CardTitle>
          <CardDescription className="text-base">
            Step-by-step guide to creating effective email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Campaign Details</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Campaign Name</p>
                    <p className="text-xs text-muted-foreground">Internal name for organization (e.g., "Newsletter - December 2024")</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Subject Line</p>
                    <p className="text-xs text-muted-foreground">What recipients see in their inbox - make it compelling!</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Gmail Configuration</p>
                    <p className="text-xs text-muted-foreground">Choose which Gmail account to send from</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Subject Line Tips</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Keep it under 50 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Create urgency or curiosity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Avoid spam trigger words</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Personalize when possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Content */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Mail className="h-4 w-4 text-white" />
            </div>
            Email Content
          </CardTitle>
          <CardDescription className="text-base">
            Design engaging email content that converts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Content Types</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">HTML Content</p>
                  <p className="text-xs text-muted-foreground">Rich formatting, images, links, and styling</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Plain Text</p>
                  <p className="text-xs text-muted-foreground">Simple text version for accessibility</p>
                </div>
              </div>

              <h4 className="font-semibold mb-3 mt-6">Content Best Practices</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Start with a clear value proposition</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use scannable formatting (headers, bullets)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Include a clear call-to-action</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep it concise and focused</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">HTML Email Tips</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium mb-1">Use Tables for Layout</p>
                  <p className="text-xs text-muted-foreground">Email clients have limited CSS support</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium mb-1">Inline CSS</p>
                  <p className="text-xs text-muted-foreground">Avoid external stylesheets</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium mb-1">Alt Text for Images</p>
                  <p className="text-xs text-muted-foreground">Many clients block images by default</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Targeting Recipients */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            Targeting Recipients
          </CardTitle>
          <CardDescription className="text-base">
            Choose who receives your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Targeting Options</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">All Users</p>
                  <p className="text-xs text-muted-foreground">Send to everyone in your database</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Specific Categories</p>
                  <p className="text-xs text-muted-foreground">Target users in selected categories</p>
                </div>
              </div>

              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <p className="font-medium mb-1">Targeting Tips</p>
                  <p className="text-sm">Start with smaller, targeted groups to test your content before sending to larger audiences.</p>
                </AlertDescription>
              </Alert>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Recipient Count</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The system will show you exactly how many recipients will receive your campaign based on your targeting selection.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Newsletter Subscribers</span>
                  <Badge variant="secondary">1,234</Badge>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Customers</span>
                  <Badge variant="secondary">567</Badge>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>All Users</span>
                  <Badge variant="secondary">1,801</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview & Testing */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            Preview & Testing
          </CardTitle>
          <CardDescription className="text-base">
            Test your campaign before sending
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Preview Options</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Desktop Preview</p>
                    <p className="text-xs text-muted-foreground">How it looks on desktop email clients</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Tablet className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Tablet Preview</p>
                    <p className="text-xs text-muted-foreground">Responsive view for tablets</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Mobile Preview</p>
                    <p className="text-xs text-muted-foreground">Optimized for mobile devices</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Testing Checklist</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Subject line is compelling and clear</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Content displays correctly on all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All links work and go to correct pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Images have alt text</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Call-to-action is clear and prominent</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 border-b border-indigo-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Scheduling & Sending
          </CardTitle>
          <CardDescription className="text-base">
            Send immediately or schedule for optimal timing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Sending Options</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Send Now</p>
                  <p className="text-xs text-muted-foreground">Campaign starts sending immediately</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Schedule for Later</p>
                  <p className="text-xs text-muted-foreground">Choose specific date and time</p>
                </div>
              </div>

              <h4 className="font-semibold mb-3 mt-6">Best Times to Send</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Tuesday - Thursday</span>
                  <Badge className="bg-green-600">Best Days</Badge>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>10 AM - 2 PM</span>
                  <Badge className="bg-blue-600">Peak Hours</Badge>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded">
                  <span>6 PM - 8 PM</span>
                  <Badge className="bg-purple-600">Evening</Badge>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Rate Limiting</h4>
              <p className="text-sm text-muted-foreground mb-3">
                The system automatically respects your Gmail daily limits and sends emails at a safe pace.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Daily Limit</span>
                  <span className="font-medium">500 emails</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Sent Today</span>
                  <span className="font-medium">127 emails</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Remaining</span>
                  <span className="font-medium text-green-600">373 emails</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Create Your Campaign?</h3>
          <p className="text-muted-foreground mb-6">
            Start creating professional email campaigns that engage your audience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/campaigns">
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
            <Link href="/docs/email-tracking">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Learn About Tracking
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}