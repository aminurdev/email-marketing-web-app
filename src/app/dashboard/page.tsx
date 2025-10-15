'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Settings, 
  Tags, 
  Send, 
  Mail,
  Upload,
  Plus,
  ArrowRight,
  FileText
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalConfigs: number;
  totalCategories: number;
  emailsSentToday: number;
  totalCampaigns: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalConfigs: 0,
    totalCategories: 0,
    emailsSentToday: 0,
    totalCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, configsRes, categoriesRes, campaignsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/gmail-configs'),
        fetch('/api/categories'),
        fetch('/api/campaigns'),
      ]);

      const [users, configs, categories, campaigns] = await Promise.all([
        usersRes.json(),
        configsRes.json(),
        categoriesRes.json(),
        campaignsRes.json(),
      ]);

      const emailsSentToday = configs.data?.reduce(
        (sum: number, config: any) => sum + (config.sentToday || 0),
        0
      ) || 0;

      setStats({
        totalUsers: users.pagination?.total || 0,
        totalConfigs: configs.data?.length || 0,
        totalCategories: categories.data?.length || 0,
        emailsSentToday,
        totalCampaigns: campaigns.data?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/3"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Gmail Configs',
      value: stats.totalConfigs,
      icon: Settings,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Tags,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Campaigns',
      value: stats.totalCampaigns,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Emails Sent Today',
      value: stats.emailsSentToday,
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Users',
      description: 'Import users from CSV file',
      href: '/dashboard/users',
      icon: Upload,
    },
    {
      title: 'Add Gmail Config',
      description: 'Configure new Gmail account',
      href: '/dashboard/gmail-configs',
      icon: Plus,
    },
    {
      title: 'Send Campaign',
      description: 'Create and send email campaign',
      href: '/dashboard/campaigns',
      icon: Send,
    },
    {
      title: 'Email History',
      description: 'Track and monitor email sends',
      href: '/dashboard/email-history',
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Your email campaign statistics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className={`${stat.bgColor} p-4 rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value.toLocaleString()}
                      </div>
                      <div className={`text-sm ${stat.color}`}>
                        {stat.title}
                      </div>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Icon className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="font-medium">{action.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}