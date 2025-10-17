"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Settings,
  Mail,
  Power,
  PowerOff,
  Trash2,
  AlertCircle,
  Send,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

interface GmailConfig {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  dailyLimit: number;
  sentToday: number;
  createdAt: string;
}

export default function GmailConfigs() {
  const [configs, setConfigs] = useState<GmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [testingConfig, setTestingConfig] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [showTestForm, setShowTestForm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dailyLimit: 500,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/gmail-configs");
      const data = await response.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up the app password (remove spaces and validate format)
    const cleanPassword = formData.password.replace(/\s/g, "");
    if (cleanPassword.length !== 16) {
      toast.error("Invalid App Password", {
        description:
          "Gmail App Password should be exactly 16 characters long (without spaces).",
      });
      return;
    }

    try {
      const response = await fetch("/api/gmail-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          password: cleanPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConfigs([...configs, data.data]);
        setFormData({ name: "", email: "", password: "", dailyLimit: 500 });
        setShowForm(false);
        toast.success("Gmail configuration added successfully!");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Failed to create config:", error);
      toast.error("Failed to create configuration");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/gmail-configs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await response.json();
      if (data.success) {
        setConfigs(
          configs.map((config) =>
            config._id === id ? { ...config, isActive: !isActive } : config
          )
        );
        toast.success(
          `Configuration ${
            !isActive ? "activated" : "deactivated"
          } successfully!`
        );
      } else {
        toast.error("Failed to update configuration");
      }
    } catch (error) {
      console.error("Failed to update config:", error);
      toast.error("Failed to update configuration");
    }
  };

  const deleteConfig = async (id: string) => {
    const loadingToast = toast.loading("Deleting configuration...", {
      description: "Please wait while we delete the Gmail configuration.",
    });

    try {
      const response = await fetch(`/api/gmail-configs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        // Remove the deleted config from the UI
        setConfigs(configs.filter((config) => config._id !== id));
        toast.success("Configuration deleted successfully!", {
          description: "The Gmail configuration has been marked as deleted and removed from your list.",
        });
      } else {
        toast.error("Failed to delete configuration", {
          description: data.error || "An error occurred while deleting the configuration.",
        });
      }
    } catch (error) {
      console.error("Failed to delete config:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete configuration", {
        description: "A network error occurred while deleting the configuration.",
      });
    }
  };



  const testConfig = async (id: string) => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid test email address");
      return;
    }

    setTestingConfig(id);
    const loadingToast = toast.loading("Sending test email...", {
      description: "Please wait while we test your Gmail configuration.",
    });

    try {
      const response = await fetch(`/api/gmail-configs/${id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Test email sent successfully! Check your inbox.", {
          description: "Your Gmail configuration is working correctly.",
        });
        setTestEmail("");
        setShowTestForm(null);
        // Refresh configs to update sent count
        fetchConfigs();
      } else {
        toast.error("Test failed", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to test config:", error);
      toast.dismiss(loadingToast);
      toast.error("Test failed", {
        description: "Network error occurred while testing the configuration.",
      });
    } finally {
      setTestingConfig(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            Gmail Configurations
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your Gmail accounts for sending email campaigns
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Configuration
        </Button>
      </div>

      <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            Gmail Setup Guide
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Follow these steps to configure your Gmail account for email
            campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Enable Two-Factor Authentication on your Gmail account
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Generate App Password
                </p>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 text-sm"
                >
                  Create App Password
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Add & Test</p>
                <p className="text-sm text-muted-foreground">
                  Add your configuration and send a test email
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                Gmail Configurations
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Manage your Gmail accounts for sending campaigns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {configs.length} configurations
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Add Gmail Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Marketing Gmail"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your-email@gmail.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">App Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={
                            showPassword
                              ? formData.password
                                  .replace(/(.{4})/g, "$1 ")
                                  .trim()
                              : formData.password
                          }
                          onChange={(e) => {
                            // Dynamically remove spaces and store clean value
                            const cleanValue = e.target.value.replace(
                              /\s/g,
                              ""
                            );
                            setFormData({ ...formData, password: cleanValue });
                          }}
                          placeholder="xxxx xxxx xxxx xxxx (16 characters)"
                          required
                          maxLength={19} // 16 chars + 3 spaces for display
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the 16-character app password from Google (spaces
                        will be removed automatically)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dailyLimit">Daily Limit</Label>
                      <Input
                        id="dailyLimit"
                        type="number"
                        value={formData.dailyLimit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dailyLimit: parseInt(e.target.value),
                          })
                        }
                        min="1"
                        max="2000"
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-3">
                        <p className="font-medium">
                          Important: Use Gmail App Password, not your regular
                          password!
                        </p>

                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-800 mb-2">
                            Setup Steps:
                          </p>
                          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                            <li>
                              Enable 2-Factor Authentication on your Gmail
                              account
                            </li>
                            <li>
                              Go to{" "}
                              <a
                                href="https://myaccount.google.com/apppasswords"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-900 inline-flex items-center gap-1"
                              >
                                Google App Passwords{" "}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </li>
                            <li>
                              Select &ldquo;Mail&rdquo; as the app and generate
                              password
                            </li>
                            <li>
                              Copy the 16-character password (format: xxxx xxxx
                              xxxx xxxx)
                            </li>
                            <li>
                              Paste it in the &ldquo;App Password&rdquo; field
                              above
                            </li>
                          </ol>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-md">
                          <p className="text-sm text-yellow-800">
                            <strong>Common Issues:</strong> Make sure
                            you&rsquo;re using the 16-character app password,
                            not your regular Gmail password. Remove any spaces
                            from the app password.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button type="submit">Save Configuration</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {configs.map((config) => (
              <Card key={config._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold">{config.name}</h3>
                        <Badge
                          variant={config.isActive ? "default" : "secondary"}
                        >
                          {config.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {config.email}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Daily Limit: {config.dailyLimit.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>
                          Sent Today: {config.sentToday.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span>
                          Remaining:{" "}
                          {(
                            config.dailyLimit - config.sentToday
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {config.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setShowTestForm(
                              showTestForm === config._id ? null : config._id
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleActive(config._id, config.isActive)
                        }
                      >
                        {config.isActive ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Gmail Configuration
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &ldquo;
                              {config.name}&rdquo;? The configuration will be marked as deleted and removed from your list, but the data will be preserved for audit purposes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteConfig(config._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {showTestForm === config._id && (
                    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Test Email Configuration
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="Enter test email address"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => testConfig(config._id)}
                            disabled={testingConfig === config._id}
                            size="sm"
                          >
                            {testingConfig === config._id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-1" />
                                Send Test
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTestForm(null)}
                          >
                            Cancel
                          </Button>
                        </div>

                        <div className="bg-muted p-3 rounded-md text-sm">
                          <div className="font-medium mb-2">
                            Test Email Preview:
                          </div>
                          <div className="space-y-1 text-muted-foreground">
                            <div>
                              <strong>Subject:</strong> Test Email from Email
                              Campaign Manager
                            </div>
                            <div>
                              <strong>From:</strong> {config.name} &lt;
                              {config.email}&gt;
                            </div>
                            <div>
                              <strong>Content:</strong> Professional test email
                              with configuration details
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        A test email will be sent to verify your Gmail
                        configuration is working correctly.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {configs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Gmail configurations found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first Gmail configuration to start sending emails
                  </p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Configuration
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
