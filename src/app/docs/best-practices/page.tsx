'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  ArrowLeft,
  Target,
  TrendingUp,
  Users,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Shield,
  Heart
} from 'lucide-react';

const practiceCategories = [
  {
    title: 'Email Content',
    icon: Mail,
    color: 'blue',
    practices: [
      {
        title: 'Write Compelling Subject Lines',
        description: 'Your subject line determines if emails get opened',
        tips: [
          'Keep it under 50 characters for mobile compatibility',
          'Create urgency or curiosity without being clickbait',
          'Avoid spam trigger words like "FREE", "URGENT", "ACT NOW"',
          'Personalize when possible (use recipient name)',
          'A/B test different approaches to see what works'
        ]
      },
      {
        title: 'Design for All Devices',
        description: 'Ensure your emails look great everywhere',
        tips: [
          'Use responsive design that works on mobile',
          'Keep email width under 600px for desktop',
          'Use large, tappable buttons (at least 44px)',
          'Test across different email clients',
          'Include alt text for all images'
        ]
      },
      {
        title: 'Clear Call-to-Actions',
        description: 'Make it obvious what you want recipients to do',
        tips: [
          'Use action-oriented language ("Download Now", "Get Started")',
          'Make buttons stand out with contrasting colors',
          'Limit to one primary CTA per email',
          'Place CTAs above the fold and at the end',
          'Test different button colors and text'
        ]
      }
    ]
  },
  {
    title: 'List Management',
    icon: Users,
    color: 'green',
    practices: [
      {
        title: 'Build Quality Lists',
        description: 'Focus on engaged subscribers, not just quantity',
        tips: [
          'Only add users who have explicitly opted in',
          'Use double opt-in for higher quality subscribers',
          'Never buy or rent email lists',
          'Regularly clean inactive subscribers',
          'Segment lists based on interests and behavior'
        ]
      },
      {
        title: 'Respect Unsubscribes',
        description: 'Make it easy to unsubscribe and honor requests immediately',
        tips: [
          'Include unsubscribe link in every email',
          'Process unsubscribe requests within 24 hours',
          'Don\'t make unsubscribing difficult or confusing',
          'Consider offering email frequency options',
          'Remove bounced emails promptly'
        ]
      }
    ]
  },
  {
    title: 'Sending Strategy',
    icon: Clock,
    color: 'purple',
    practices: [
      {
        title: 'Timing & Frequency',
        description: 'Send at the right time and frequency for your audience',
        tips: [
          'Test different days and times to find optimal sending windows',
          'Tuesday-Thursday typically perform better than Monday/Friday',
          'Mid-morning (10-11 AM) and early evening (6-8 PM) often work well',
          'Don\'t send too frequently - respect your audience\'s inbox',
          'Be consistent with your sending schedule'
        ]
      },
      {
        title: 'Gradual Volume Increase',
        description: 'Build your sending reputation slowly',
        tips: [
          'Start with small volumes (100-200 emails/day)',
          'Gradually increase volume over weeks/months',
          'Monitor delivery rates and adjust accordingly',
          'Use multiple Gmail accounts for higher volumes',
          'Maintain consistent sending patterns'
        ]
      }
    ]
  },
  {
    title: 'Performance Tracking',
    icon: BarChart3,
    color: 'orange',
    practices: [
      {
        title: 'Monitor Key Metrics',
        description: 'Track the right metrics to improve performance',
        tips: [
          'Focus on delivery rate (should be >95%)',
          'Track open rates (aim for 20-25%)',
          'Monitor click rates (2-5% is typical)',
          'Watch bounce rates (keep under 2%)',
          'Analyze unsubscribe rates for content quality'
        ]
      },
      {
        title: 'A/B Testing',
        description: 'Continuously test and improve your campaigns',
        tips: [
          'Test one element at a time (subject line, CTA, timing)',
          'Use statistically significant sample sizes',
          'Test with a small portion before sending to full list',
          'Document results and apply learnings',
          'Test regularly - audience preferences change'
        ]
      }
    ]
  }
];

const commonMistakes = [
  {
    mistake: 'Sending to purchased lists',
    why: 'Recipients haven\'t consented, leading to spam complaints and poor deliverability',
    solution: 'Build your own list through opt-ins and lead magnets'
  },
  {
    mistake: 'Ignoring mobile optimization',
    why: 'Over 60% of emails are opened on mobile devices',
    solution: 'Use responsive design and test on multiple devices'
  },
  {
    mistake: 'Too many images, not enough text',
    why: 'Spam filters flag image-heavy emails, and images may not load',
    solution: 'Balance images with text, include alt text'
  },
  {
    mistake: 'Sending too frequently',
    why: 'Overwhelms subscribers and increases unsubscribe rates',
    solution: 'Find the right frequency through testing and feedback'
  },
  {
    mistake: 'Generic, irrelevant content',
    why: 'Low engagement leads to poor sender reputation',
    solution: 'Segment lists and personalize content based on interests'
  }
];

export default function BestPracticesPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Email Marketing Best Practices</h1>
          <p className="text-muted-foreground mt-1">
            Proven strategies for successful email campaigns
          </p>
        </div>
      </div>

      {/* Overview */}
      <Alert className="bg-blue-50 border-blue-200">
        <Target className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p className="font-medium">Key Success Factors:</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Build quality, engaged email lists with proper consent</li>
              <li>• Create compelling, mobile-optimized content</li>
              <li>• Send at optimal times with appropriate frequency</li>
              <li>• Monitor performance and continuously improve</li>
              <li>• Maintain good sender reputation and deliverability</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Best Practices by Category */}
      {practiceCategories.map((category, categoryIndex) => {
        const Icon = category.icon;
        const colorClasses = {
          blue: 'from-blue-50/50 to-purple-50/50 border-blue-100',
          green: 'from-green-50/50 to-emerald-50/50 border-green-100',
          purple: 'from-purple-50/50 to-pink-50/50 border-purple-100',
          orange: 'from-orange-50/50 to-red-50/50 border-orange-100'
        };

        return (
          <Card key={categoryIndex} className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} border-b`}>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {category.title} Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {category.practices.map((practice, practiceIndex) => (
                  <div key={practiceIndex} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">{practice.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{practice.description}</p>
                      </div>
                    </div>
                    <ul className="ml-8 space-y-1">
                      {practice.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Common Mistakes */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50/50 to-pink-50/50 border-b border-red-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            Common Mistakes to Avoid
          </CardTitle>
          <CardDescription className="text-base">
            Learn from these frequent email marketing pitfalls
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {commonMistakes.map((mistake, index) => (
              <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 mb-1">{mistake.mistake}</h4>
                    <p className="text-sm text-red-700 mb-2"><strong>Why it's bad:</strong> {mistake.why}</p>
                    <p className="text-sm text-green-800"><strong>Solution:</strong> {mistake.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Benchmarks */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Industry Benchmarks
          </CardTitle>
          <CardDescription className="text-base">
            Compare your performance against industry standards
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-800 mb-1">95%+</div>
              <div className="text-sm font-medium text-green-700 mb-1">Delivery Rate</div>
              <div className="text-xs text-green-600">Emails reaching inboxes</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-800 mb-1">20-25%</div>
              <div className="text-sm font-medium text-blue-700 mb-1">Open Rate</div>
              <div className="text-xs text-blue-600">Emails opened by recipients</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-800 mb-1">2-5%</div>
              <div className="text-sm font-medium text-purple-700 mb-1">Click Rate</div>
              <div className="text-xs text-purple-600">Links clicked in emails</div>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-800 mb-1">&lt;2%</div>
              <div className="text-sm font-medium text-orange-700 mb-1">Bounce Rate</div>
              <div className="text-xs text-orange-600">Emails that bounced</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Benchmarks vary by industry, audience, and email type. 
              Focus on improving your own metrics over time rather than just hitting industry averages.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Legal Compliance */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 border-b border-indigo-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            Legal Compliance
          </CardTitle>
          <CardDescription className="text-base">
            Stay compliant with email marketing laws and regulations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">CAN-SPAM Act (US)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Include your physical business address</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use truthful subject lines and sender information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide clear unsubscribe mechanism</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Honor unsubscribe requests within 10 days</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">GDPR (EU)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Obtain explicit consent before sending emails</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Provide clear privacy policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Allow users to access and delete their data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep records of consent</span>
                </li>
              </ul>
            </div>
          </div>
          <Alert className="mt-6 bg-yellow-50 border-yellow-200">
            <Shield className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <p className="font-medium mb-1">Legal Disclaimer</p>
              <p className="text-sm">This is general guidance only. Consult with legal professionals for specific compliance requirements in your jurisdiction.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Success Tips */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-50/50 to-rose-50/50 border-b border-pink-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            Pro Tips for Success
          </CardTitle>
          <CardDescription className="text-base">
            Advanced strategies from email marketing experts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Content Strategy</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Use storytelling to create emotional connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Include social proof (testimonials, reviews)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Create urgency with limited-time offers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Use power words that trigger action</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Advanced Techniques</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Implement behavioral triggers and automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Use dynamic content based on user data</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Optimize send times for individual users</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Create re-engagement campaigns for inactive users</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to Apply These Practices?</h3>
          <p className="text-muted-foreground mb-6">
            Start implementing these best practices in your email campaigns today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/campaigns">
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
            <Link href="/docs/email-tracking">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Track Performance
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}