"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Mail,
  Users,
  Tags,
  Send,
  Settings,
  Menu,
  X,
  Database,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Gmail Configs", href: "/dashboard/gmail-configs", icon: Settings },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Categories", href: "/dashboard/categories", icon: Tags },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { name: "Email History", href: "/dashboard/email-history", icon: Mail },
  { name: "Database", href: "/dashboard/database", icon: Database },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 h-9 w-9"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center min-w-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                    Email Campaign Manager
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Professional email marketing platform
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden md:inline">System Online</span>
                <span className="md:hidden">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
            fixed lg:sticky top-14 sm:top-16 z-50 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]
            w-72 sm:w-64 transform transition-transform duration-300 ease-in-out
            lg:transform-none lg:transition-none
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <div className="h-full py-4 sm:py-6 pr-3 sm:pr-6">
              <Card className="h-full shadow-lg border-0 bg-gradient-to-b from-white to-gray-50/50">
                <div className="p-4 sm:p-6 h-full flex flex-col">
                  <nav className="space-y-1 sm:space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            group flex items-center px-3 sm:px-4 py-3 sm:py-3 rounded-xl text-sm font-medium 
                            transition-all duration-200 ease-in-out transform hover:scale-[1.02]
                            touch-manipulation min-h-[44px]
                            ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                : "text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-md"
                            }
                          `}
                        >
                          <Icon
                            className={`
                            h-5 w-5 mr-3 transition-transform duration-200 flex-shrink-0
                            ${
                              isActive
                                ? "text-white"
                                : "text-gray-500 group-hover:text-gray-700"
                            }
                            group-hover:scale-110
                          `}
                          />
                          <span className="font-medium truncate">{item.name}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  <Separator className="my-4 sm:my-6" />

                  <div className="mt-auto pt-4 sm:pt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        Need Help?
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        Check our documentation for guides and tutorials
                      </div>
                      <Link href="/docs">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs min-h-[36px] touch-manipulation"
                        >
                          View Docs
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 py-4 sm:py-6 lg:pl-6 transition-all duration-300 ease-in-out">
            <div className="max-w-none">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
