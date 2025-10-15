'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  Mail,
  Eye,
  MousePointer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Clock,

} from 'lucide-react';

const trackingEvents = [
  {
    event: 'Sent',
    icon: Mail,
    color: 'blue',
    description: 'Email was successfully sent from Gmail',
    timing: 'Immediate'
  },
  {
    event: 'Delivered',
    icon: CheckCircle,
    color: 'green',
    description: 'Email reached the recipient\'s inbox',
    timing: 'Within minutes'
  },
  {
    event: 'Opened',
    icon: Eye,
    color: 'purple',
    description: 'Recipient opened the email',
    timing: 'When opened'
  },
  {
    event: 'Clicked',
    icon: MousePointer,
    color: 'orange',
    description: 'Recipient clicked a link in the email',
    timing: 'When clicked'
  },
  {
    event: 'Bounced',
    icon: AlertTriangle,
    color: 'yellow',
    description: 'Email could not be delivered',
    timing: 'Within hours'
  },
  {
    event: 'Failed',
    icon: XCircle,
    color: 'red',
    description: 'Email sending failed',
    timing: 'Immediate'
  }
];

const metrics = [
  {
    name: 'Delivery Rate',
    description: 'Percentage of emails that reached inboxes',
    formula: '(Delivered ÷ Sent) × 100',
    benchmark: '95%+',
    color: 'green'
  },
  {
    name: 'Open Rate',
    description: 'Percentage of delivered emails that were opened',
    formula: '(Opened ÷ Delivered) × 100',
    benchmark: '20-25%',
    color: 'blue'
  },
  {
    name: 'Click Rate',
    description: 'Percentage of opened emails with link clicks',
    formula: '(Clicked ÷ Opened) × 100',
    benchmark: '2-5%',
    color: 'purple'
  },
  {
    name: 'Bounce Rate',
    description: 'Percentage of emails that bounced',
    formula: '(Bounced ÷ Sent) × 100',
    benchmark: '<2%',
    color: 'red'
  }
];

export default function EmailTrackingPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Email Tracking & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Monitor email performance and campaign effectiveness
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <BarChart3 className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">Email Tracking Features:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Real-time delivery status tracking</li>
              <li>• Open and click tracking with timestamps</li>
              <li>• Campaign performance analytics</li>
              <li>• Bounce and failure monitoring</li>
              <li>• Historical data and trends</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Tracking Events */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            Email Tracking Events
          </CardTitle>
          <CardDescription className="text-base">
            Understanding what each tracking event means
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackingEvents.map((event, index) => {
              const Icon = event.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-800 border-blue-200',
                green: 'bg-green-100 text-green-800 border-green-200',
                purple: 'bg-purple-100 text-purple-800 border-purple-200',
                orange: 'bg-orange-100 text-orange-800 border-orange-200',
                yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                red: 'bg-red-100 text-red-800 border-red-200'
              };

              return (
                <div key={index} className={`p-4 rounded-lg border ${colorClasses[event.color as keyof typeof colorClasses]}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5" />
                    <h4 className="font-semibold">{event.event}</h4>
                  </div>
                  <p className="text-sm mb-2">{event.description}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{event.timing}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Key Performance Metrics
          </CardTitle>
          <CardDescription className="text-base">
            Important metrics to monitor for campaign success
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, index) => {
              const colorClasses = {
                green: 'border-l-green-500 bg-green-50',
                blue: 'border-l-blue-500 bg-blue-50',
                purple: 'border-l-purple-500 bg-purple-50',
                red: 'border-l-red-500 bg-red-50'
              };

              return (
                <div key={index} className={`p-4 border-l-4 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{metric.name}</h4>
                    <Badge variant="secondary">{metric.benchmark}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{metric.description}</p>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    {metric.formula}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email History Dashboard */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Using the Email History Dashboard
          </CardTitle>
          <CardDescription className="text-base">
            Navigate and analyze your email tracking data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Dashboard Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-time Statistics:</strong> Live overview of email performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Filtering Options:</strong> Filter by status, date, campaign, or category</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Search Functionality:</strong> Find specific emails or recipients</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Detailed Logs:</strong> Complete history with timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Export Options:</strong> Download data for external analysis</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Link href="/dashboard/email-history">
                  <Button className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Email History
                  </Button>
                </Link>
                <Link href="/dashboard/campaigns">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    View Campaigns
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Access detailed analytics and performance data for all your email campaigns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improving Performance */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-red-50/50 border-b border-orange-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Improving Email Performance
          </CardTitle>
          <CardDescription className="text-base">
            Use tracking data to optimize your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-800">✅ Good Performance Indicators</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Delivery rate above 95%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Open rate above 20%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bounce rate below 2%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Click rate above 2%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Low failure/error rates</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-red-800">⚠️ Warning Signs</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>High bounce rates (&gt;5%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Low open rates (&lt;10%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Many delivery failures</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>No clicks on links</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Declining performance over time</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Optimization Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• A/B test different subject lines to improve open rates</li>
              <li>• Clean your email list regularly to reduce bounces</li>
              <li>• Segment your audience for more targeted content</li>
              <li>• Monitor sending reputation and adjust frequency</li>
              <li>• Use engaging content and clear call-to-actions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Start Tracking Your Campaigns</h3>
          <p className="text-muted-foreground mb-6">
            Monitor your email performance and optimize for better results.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/email-history">
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Email Analytics
              </Button>
            </Link>
            <Link href="/docs/best-practices">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Learn Best Practices
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}