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
import Link from "next/link";
import {
  BookOpen,
  Settings,
  Users,
  Send,
  Mail,
  Tags,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Clock,
} from "lucide-react";

const quickStartGuides = [
  {
    title: "Getting Started",
    description:
      "Set up your first Gmail configuration and send your first campaign",
    href: "/docs/getting-started",
    icon: Zap,
    time: "5 min read",
    difficulty: "Beginner",
  },
  {
    title: "Gmail Setup",
    description:
      "Configure Gmail accounts with app passwords for secure sending",
    href: "/docs/gmail-setup",
    icon: Settings,
    time: "10 min read",
    difficulty: "Beginner",
  },
  {
    title: "User Management",
    description: "Import users from CSV and organize them into categories",
    href: "/docs/user-management",
    icon: Users,
    time: "8 min read",
    difficulty: "Beginner",
  },
  {
    title: "Creating Campaigns",
    description: "Design and send professional email campaigns",
    href: "/docs/campaigns",
    icon: Send,
    time: "12 min read",
    difficulty: "Intermediate",
  },
];

const features = [
  {
    title: "Multiple Gmail Accounts",
    description:
      "Manage multiple Gmail configurations with daily limits and monitoring",
    icon: Settings,
    href: "/docs/gmail-setup",
  },
  {
    title: "User Categories",
    description: "Organize recipients into categories for targeted campaigns",
    icon: Tags,
    href: "/docs/user-management",
  },
  {
    title: "Email Tracking",
    description: "Monitor delivery, opens, clicks, and campaign performance",
    icon: Mail,
    href: "/docs/email-tracking",
  },
  {
    title: "Bulk Import",
    description: "Import thousands of users from CSV files with validation",
    icon: Users,
    href: "/docs/user-management",
  },
];

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/users",
    description: "Fetch users with filtering and pagination",
  },
  { method: "POST", path: "/api/users", description: "Create a new user" },
  {
    method: "POST",
    path: "/api/users/upload-csv",
    description: "Bulk import users from CSV",
  },
  { method: "GET", path: "/api/campaigns", description: "List all campaigns" },
  {
    method: "POST",
    path: "/api/campaigns",
    description: "Create a new campaign",
  },
  {
    method: "POST",
    path: "/api/campaigns/[id]/send",
    description: "Send or schedule a campaign",
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Email Campaign Manager Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know to create, manage, and send professional
          email campaigns
        </p>
      </div>

      {/* Quick Start Guides */}
      <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Quick Start Guides
          </CardTitle>
          <CardDescription className="text-base">
            Get up and running quickly with these step-by-step guides
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStartGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link key={guide.title} href={guide.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border-0 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {guide.time}
                          </Badge>
                          <Badge
                            variant={
                              guide.difficulty === "Beginner"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {guide.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {guide.description}
                      </p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        Read Guide
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card className=" border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Globe className="h-4 w-4 text-white" />
            </div>
            Platform Features
          </CardTitle>
          <CardDescription className="text-base">
            Explore the powerful features that make email marketing easy
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card className=" border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            API Reference
          </CardTitle>
          <CardDescription className="text-base">
            Integrate with our REST API for custom applications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      endpoint.method === "GET" ? "default" : "secondary"
                    }
                    className="font-mono text-xs"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {endpoint.path}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/docs/api">
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                View Full API Documentation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Troubleshooting</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Common issues and solutions
            </p>
            <Link href="/docs/troubleshooting">
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Best practices for secure email sending
            </p>
            <Link href="/docs/security">
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Best Practices</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tips for effective email campaigns
            </p>
            <Link href="/docs/best-practices">
              <Button variant="outline" size="sm">
                Read Tips
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
