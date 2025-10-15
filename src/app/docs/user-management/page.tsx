'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  Users,
  Upload,
  Plus,
  Tags,
  FileText,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';

export default function UserManagementPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Import, organize, and manage your email recipients
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <Users className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">User Management Features:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Add users individually or import from CSV files</li>
              <li>• Organize users into categories for targeted campaigns</li>
              <li>• Search and filter users by name, email, or category</li>
              <li>• Track user status and creation dates</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Adding Individual Users */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Adding Individual Users
          </CardTitle>
          <CardDescription className="text-base">
            Perfect for adding a few users quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Required Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      The recipient's full name (e.g., "John Doe")
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">
                      A valid email address for the recipient
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">
                      Choose an existing category or use "General"
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quick Action</h4>
              <Link href="/dashboard/users">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Users Now
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                Go to the Users page to start adding recipients
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSV Import */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Upload className="h-4 w-4 text-white" />
            </div>
            CSV Import
          </CardTitle>
          <CardDescription className="text-base">
            Import hundreds or thousands of users at once
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                CSV Format Requirements
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-medium mb-2">Your CSV file must have exactly 2 columns:</p>
                <div className="bg-white p-3 rounded border font-mono text-sm">
                  name,email<br />
                  John Doe,john@example.com<br />
                  Jane Smith,jane@example.com<br />
                  Bob Wilson,bob@example.com
                </div>
                <div className="mt-3 text-sm text-muted-foreground space-y-1">
                  <p>• First row must be headers: <code>name,email</code></p>
                  <p>• Each subsequent row should have a name and valid email</p>
                  <p>• All users will be assigned to the same category</p>
                  <p>• Duplicate emails will be skipped automatically</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Import Process</h4>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Prepare your CSV file with the correct format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Choose or create a category for all users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Upload the file and review the results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Check the imported users in your database</span>
                  </li>
                </ol>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Tools & Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Template
                  </Button>
                  <Link href="/dashboard/users">
                    <Button size="sm" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV File
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Tags className="h-4 w-4 text-white" />
            </div>
            User Categories
          </CardTitle>
          <CardDescription className="text-base">
            Organize users for targeted email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Why Use Categories?</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Targeted Campaigns:</strong> Send specific content to relevant audiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Better Organization:</strong> Keep different types of contacts separate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Easy Filtering:</strong> Quickly find and manage specific user groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Performance Tracking:</strong> Monitor how different segments respond</span>
                </li>
              </ul>

              <h4 className="font-semibold mb-3 mt-6">Category Examples</h4>
              <div className="space-y-2">
                <Badge variant="secondary" className="mr-2">Newsletter Subscribers</Badge>
                <Badge variant="secondary" className="mr-2">Customers</Badge>
                <Badge variant="secondary" className="mr-2">Prospects</Badge>
                <Badge variant="secondary" className="mr-2">VIP Members</Badge>
                <Badge variant="secondary" className="mr-2">Event Attendees</Badge>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Manage Categories</h4>
              <Link href="/dashboard/categories">
                <Button className="w-full justify-start mb-3">
                  <Tags className="h-4 w-4 mr-2" />
                  Create & Manage Categories
                </Button>
              </Link>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Create categories before importing users</p>
                <p>• Each user belongs to exactly one category</p>
                <p>• Categories can be used in campaign targeting</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-800">✅ Do This</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Verify email addresses before importing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use descriptive category names</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep your user lists up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Test with a small group first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Respect unsubscribe requests</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-800">❌ Avoid This</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't import without permission</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't use purchased email lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't ignore bounce notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't send to inactive addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Don't mix different audience types</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Create Campaigns?</h3>
          <p className="text-muted-foreground mb-6">
            Now that you have users organized, you can start creating targeted email campaigns.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/docs/campaigns">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Create Campaigns
              </Button>
            </Link>
            <Link href="/dashboard/users">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}