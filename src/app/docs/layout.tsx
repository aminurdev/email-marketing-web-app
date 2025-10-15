import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Documentation
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Email Campaign Manager Guide
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Help Center
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50/50 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Quick Start</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/docs/getting-started" className="hover:text-foreground">Getting Started</Link></li>
                  <li><Link href="/docs/gmail-setup" className="hover:text-foreground">Gmail Setup</Link></li>
                  <li><Link href="/docs/user-management" className="hover:text-foreground">User Management</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/docs/campaigns" className="hover:text-foreground">Email Campaigns</Link></li>
                  <li><Link href="/docs/email-tracking" className="hover:text-foreground">Email Tracking</Link></li>
                  <li><Link href="/docs/api" className="hover:text-foreground">API Reference</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/docs/troubleshooting" className="hover:text-foreground">Troubleshooting</Link></li>
                  <li><Link href="/docs/best-practices" className="hover:text-foreground">Best Practices</Link></li>
                  <li><Link href="/docs/security" className="hover:text-foreground">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Email Campaign Manager. Built with Next.js and shadcn/ui.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}