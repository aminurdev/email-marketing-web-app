"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Settings,
  Tags,
  Send,
  Mail,
  Upload,
  Plus,
  ArrowRight,
  FileText,
  LayoutDashboard,
} from "lucide-react";

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
      const [usersRes, configsRes, categoriesRes, campaignsRes] =
        await Promise.all([
          fetch("/api/users"),
          fetch("/api/gmail-configs"),
          fetch("/api/categories"),
          fetch("/api/campaigns"),
        ]);

      const [users, configs, categories, campaigns] = await Promise.all([
        usersRes.json(),
        configsRes.json(),
        categoriesRes.json(),
        campaignsRes.json(),
      ]);

      const emailsSentToday =
        configs.data?.reduce(
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
      console.error("Failed to fetch stats:", error);
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
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Gmail Configs",
      value: stats.totalConfigs,
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tags,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Campaigns",
      value: stats.totalCampaigns,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Emails Sent Today",
      value: stats.emailsSentToday,
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      title: "Upload Users",
      description: "Import users from CSV file",
      href: "/dashboard/users",
      icon: Upload,
    },
    {
      title: "Add Gmail Config",
      description: "Configure new Gmail account",
      href: "/dashboard/gmail-configs",
      icon: Plus,
    },
    {
      title: "Send Campaign",
      description: "Create and send email campaign",
      href: "/dashboard/campaigns",
      icon: Send,
    },
    {
      title: "Email History",
      description: "Track and monitor email sends",
      href: "/dashboard/email-history",
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor your email campaigns and system performance
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">All Systems Operational</span>
        </div>
      </div>

      <Card className=" border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            System Overview
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Your email campaign statistics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.title}
                      </div>
                    </div>
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className=" border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Get started with common tasks and workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border-0 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-3">
                              <Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {action.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-2" />
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
