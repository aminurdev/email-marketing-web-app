'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  Tags, 
  Send,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Gmail Configs', href: '/dashboard/gmail-configs', icon: Settings },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Categories', href: '/dashboard/categories', icon: Tags },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Send },
  { name: 'Email History', href: '/dashboard/email-history', icon: Mail },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-semibold">
                Email Campaign Manager
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="w-64">
            <Card className="p-6">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </Card>
          </aside>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}