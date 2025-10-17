"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Calendar,
  Users,

  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Play,

  Search,

  Monitor,
  Smartphone,
  Tablet,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface GmailConfig {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  dailyLimit: number;
  sentToday: number;
}

interface Category {
  _id: string;
  name: string;
  userCount: number;
}

interface Campaign {
  _id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  recipients: string[];
  gmailConfigId: {
    _id: string;
    name: string;
    email: string;
  };
  status: "draft" | "scheduled" | "sending" | "completed" | "failed";
  scheduledAt?: string;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [gmailConfigs, setGmailConfigs] = useState<GmailConfig[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("list");
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    htmlContent: "",
    textContent: "",
    recipients: [] as string[],
    gmailConfigId: "",
    scheduleAt: "",
  });

  const fetchData = async () => {
    try {
      const [configsRes, categoriesRes] = await Promise.all([
        fetch("/api/gmail-configs"),
        fetch("/api/categories"),
      ]);

      const [configs, categories] = await Promise.all([
        configsRes.json(),
        categoriesRes.json(),
      ]);

      if (configs.success) {
        const activeConfigs = configs.data.filter((c: GmailConfig) => c.isActive);
        
        // If no active configs, show all configs with a warning
        if (activeConfigs.length === 0 && configs.data.length > 0) {
          setGmailConfigs(configs.data);
          toast.warning('No active Gmail configurations', {
            description: 'Showing all configurations. Please activate at least one in Gmail Configs page.',
          });
        } else {
          setGmailConfigs(activeConfigs);
        }
      }
      if (categories.success) {
        setCategories(categories.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data", {
        description: "Could not load Gmail configurations and categories. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/campaigns?${params}`);
      const data = await response.json();

      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchData();
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleRecipientChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        recipients: [...formData.recipients, value],
      });
    } else {
      setFormData({
        ...formData,
        recipients: formData.recipients.filter((r) => r !== value),
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      htmlContent: "",
      textContent: "",
      recipients: [],
      gmailConfigId: "",
      scheduleAt: "",
    });
    setEditingCampaign(null);
  };

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      htmlContent: campaign.htmlContent,
      textContent: campaign.textContent || "",
      recipients: [], // Will be populated based on campaign data
      gmailConfigId: campaign.gmailConfigId._id,
      scheduleAt: campaign.scheduledAt
        ? new Date(campaign.scheduledAt).toISOString().slice(0, 16)
        : "",
    });
    setEditingCampaign(campaign);
    setActiveTab("create");
  };

  const handleDuplicate = (campaign: Campaign) => {
    setFormData({
      name: `${campaign.name} (Copy)`,
      subject: campaign.subject,
      htmlContent: campaign.htmlContent,
      textContent: campaign.textContent || "",
      recipients: [], // Will be populated based on campaign data
      gmailConfigId: campaign.gmailConfigId._id,
      scheduleAt: "",
    });
    setEditingCampaign(null);
    setActiveTab("create");
    toast.success("Campaign duplicated", {
      description: "You can now modify and save the duplicated campaign.",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.name ||
      !formData.subject ||
      !formData.htmlContent ||
      !formData.gmailConfigId
    ) {
      toast.error("Missing required fields", {
        description:
          "Please fill in name, subject, content, and Gmail configuration.",
      });
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      editingCampaign ? "Updating campaign..." : "Saving campaign...",
      {
        description: "Please wait while we save your campaign.",
      }
    );

    try {
      const url = editingCampaign
        ? `/api/campaigns/${editingCampaign._id}`
        : "/api/campaigns";
      const method = editingCampaign ? "PUT" : "POST";



      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success(
          `Campaign ${editingCampaign ? "updated" : "saved"} successfully!`,
          {
            description: `Your campaign is ready with ${data.recipientCount} recipients.`,
          }
        );
        resetForm();
        setActiveTab("list");
        fetchCampaigns();
      } else {
        toast.error(
          `Failed to ${editingCampaign ? "update" : "save"} campaign`,
          {
            description: data.error,
          }
        );
      }
    } catch (error) {
      console.error("Failed to save campaign:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to save campaign", {
        description: "An error occurred while saving your campaign.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (campaign: Campaign, scheduleAt?: string) => {
    setSending(true);
    const loadingToast = toast.loading(
      scheduleAt ? "Scheduling campaign..." : "Starting campaign...",
      {
        description: "Please wait while we process your email campaign.",
      }
    );

    try {
      const response = await fetch(`/api/campaigns/${campaign._id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleAt }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success(
          `Campaign ${scheduleAt ? "scheduled" : "started"} successfully!`,
          {
            description: `Your campaign will be sent to ${data.recipientCount} recipients.`,
          }
        );
        fetchCampaigns();
      } else {
        toast.error("Campaign failed", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to send campaign:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to send campaign", {
        description: "An error occurred while processing your campaign.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Campaign deleted successfully!");
        fetchCampaigns();
      } else {
        toast.error("Failed to delete campaign", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  const getTotalRecipients = () => {
    if (formData.recipients.includes("all")) {
      return categories.reduce((sum, cat) => sum + cat.userCount, 0);
    }
    return formData.recipients
      .filter((r) => r.startsWith("category:"))
      .reduce((sum, r) => {
        const categoryName = r.replace("category:", "");
        const category = categories.find((c) => c.name === categoryName);
        return sum + (category?.userCount || 0);
      }, 0);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: {
        variant: "secondary" as const,
        icon: Edit,
        color: "text-gray-600",
      },
      scheduled: {
        variant: "default" as const,
        icon: Calendar,
        color: "text-blue-600",
      },
      sending: {
        variant: "default" as const,
        icon: Clock,
        color: "text-orange-600",
      },
      completed: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-green-600",
      },
      failed: {
        variant: "destructive" as const,
        icon: AlertTriangle,
        color: "text-red-600",
      },
    };

    const config = variants[status as keyof typeof variants] || variants.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      case "desktop":
      default:
        return "max-w-4xl mx-auto";
    }
  };

  const [previewData, setPreviewData] = useState({
    subject: "",
    htmlContent: "",
    textContent: "",
    gmailConfigId: "",
  });

  const EmailPreview = () => {
    const previewContent =
      previewData.htmlContent || "<p>No content to preview</p>";
    const previewSubject = previewData.subject || "No subject";
    const selectedConfig = gmailConfigs.find(
      (c) => c._id === previewData.gmailConfigId
    );

    return (
      <AlertDialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Email Preview
            </AlertDialogTitle>
            <AlertDialogDescription>
              Preview how your email will appear to recipients
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Device Toggle */}
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant={previewDevice === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={previewDevice === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewDevice("tablet")}
              >
                <Tablet className="h-4 w-4 mr-1" />
                Tablet
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </Button>
            </div>

            {/* Email Preview */}
            <div className={`${getDeviceStyles()} transition-all duration-300`}>
              <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
                {/* Email Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">From:</span>
                      <span className="text-muted-foreground">
                        {selectedConfig
                          ? `${selectedConfig.name} <${selectedConfig.email}>`
                          : "Select Gmail Config"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Subject:</span>
                      <span className="text-muted-foreground font-medium">
                        {previewSubject}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Recipients:</span>
                      <span className="text-muted-foreground">
                        {getTotalRecipients()} recipients
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Content */}
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div
                    className="prose prose-sm max-w-none email-preview-content"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      lineHeight: "1.6",
                      color: "#374151",
                    }}
                  />
                </div>

                {/* Text Version Preview */}
                {previewData.textContent && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="text-sm font-medium mb-2">
                      Text Version:
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap font-mono text-xs bg-white p-3 rounded border">
                      {previewData.textContent}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                This is a preview of how your email will appear to recipients.
              </p>
              <p>
                Actual rendering may vary slightly depending on the email
                client.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close Preview</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Tabs Skeleton */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              <div className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            {/* Filters Skeleton */}
            <div className="flex gap-4 items-center mb-6">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-[150px] h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border">
              <div className="p-4 border-b bg-gray-50">
                <div className="grid grid-cols-7 gap-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b">
                  <div className="grid grid-cols-7 gap-4 items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Send className="h-5 w-5 text-white" />
            </div>
            Email Campaigns
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Create, manage, and send professional email campaigns to your
            audience
          </p>
        </div>
      </div>

      <Card className=" border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Send className="h-4 w-4 text-white" />
            </div>
            Campaign Management
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Create, edit, and send professional email campaigns with advanced
            scheduling
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Campaign List</TabsTrigger>
              <TabsTrigger value="create">
                {editingCampaign ? "Edit Campaign" : "Create Campaign"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={statusFilter || "all"}
                  onValueChange={(value) =>
                    setStatusFilter(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sending">Sending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setActiveTab("create")}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              </div>

              {/* Campaigns Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Gmail Config</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {campaign.subject}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {campaign.gmailConfigId.name}
                            </div>
                            <div className="text-muted-foreground">
                              {campaign.gmailConfigId.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(campaign.status)}
                          {campaign.scheduledAt && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(campaign.scheduledAt).toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{campaign.recipients.length} recipients</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-green-600">
                              Sent: {campaign.sentCount}
                            </div>
                            {campaign.failedCount > 0 && (
                              <div className="text-red-600">
                                Failed: {campaign.failedCount}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewData({
                                  subject: campaign.subject,
                                  htmlContent: campaign.htmlContent,
                                  textContent: campaign.textContent || "",
                                  gmailConfigId: campaign.gmailConfigId._id,
                                });
                                setPreviewOpen(true);
                              }}
                              title="Preview Email"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {campaign.status === "draft" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(campaign)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDuplicate(campaign)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Send Campaign
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to send &ldquo;
                                        {campaign.name}&rdquo; to{" "}
                                        {campaign.recipients.length} recipients?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleSend(campaign)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        Send Now
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Campaign
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete &ldquo;
                                        {campaign.name}&rdquo;? This action
                                        cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDelete(campaign._id)
                                        }
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            {campaign.status !== "draft" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDuplicate(campaign)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {campaigns.length === 0 && (
                  <div className="p-12 text-center">
                    <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No campaigns found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first email campaign to get started
                    </p>
                    <Button onClick={() => setActiveTab("create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Newsletter - December 2024"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gmailConfig">Gmail Configuration *</Label>
                    <Select
                      value={formData.gmailConfigId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gmailConfigId: value })
                      }
                    >
                      <SelectTrigger className={!formData.gmailConfigId ? "border-red-300" : ""}>
                        <SelectValue placeholder="Select Gmail Config" />
                      </SelectTrigger>
                      <SelectContent>
                        {gmailConfigs.length > 0 ? (
                          gmailConfigs.map((config) => (
                            <SelectItem key={config._id} value={config._id}>
                              {config.name} ({config.email}) -{" "}
                              {config.dailyLimit - config.sentToday} remaining
                              {!config.isActive && " (Inactive)"}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No Gmail configurations available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Your amazing newsletter subject"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="htmlContent">HTML Content *</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const template = `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
    <h1 style="color: #2563eb; margin: 0;">Welcome to Our Newsletter!</h1>
  </div>
  
  <div style="padding: 30px 20px;">
    <h2 style="color: #1f2937;">Hello {{name}}!</h2>
    
    <p>Thank you for subscribing to our newsletter. We're excited to share the latest updates with you.</p>
    
    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1e40af; margin-top: 0;">What's New?</h3>
      <ul>
        <li>Feature updates and improvements</li>
        <li>Industry insights and tips</li>
        <li>Exclusive offers and promotions</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="#" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Learn More
      </a>
    </div>
    
    <p>Best regards,<br>The Team</p>
  </div>
  
  <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
    <p>You received this email because you subscribed to our newsletter.</p>
    <p><a href="#" style="color: #6b7280;">Unsubscribe</a> | <a href="#" style="color: #6b7280;">Update Preferences</a></p>
  </div>
</div>`.trim();
                          setFormData({ ...formData, htmlContent: template });
                        }}
                        disabled={formData.htmlContent.length > 0}
                        title={
                          formData.htmlContent.length > 0
                            ? "Clear content first to use template"
                            : "Use sample template"
                        }
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Template
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewData({
                            subject: formData.subject,
                            htmlContent: formData.htmlContent,
                            textContent: formData.textContent,
                            gmailConfigId: formData.gmailConfigId,
                          });
                          setPreviewOpen(true);
                        }}
                        disabled={!formData.htmlContent && !formData.subject}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="htmlContent"
                    value={formData.htmlContent}
                    onChange={(e) =>
                      setFormData({ ...formData, htmlContent: e.target.value })
                    }
                    rows={10}
                    placeholder="<h1>Hello!</h1><p>Your HTML email content here...</p>"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textContent">Text Content (optional)</Label>
                  <Textarea
                    id="textContent"
                    value={formData.textContent}
                    onChange={(e) =>
                      setFormData({ ...formData, textContent: e.target.value })
                    }
                    rows={5}
                    placeholder="Plain text version of your email..."
                  />
                </div>

                <div className="space-y-3">
                  <Label>Recipients</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="all-users"
                        checked={formData.recipients.includes("all")}
                        onChange={(e) =>
                          handleRecipientChange("all", e.target.checked)
                        }
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor="all-users"
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" />
                        All Users (
                        {categories.reduce(
                          (sum, cat) => sum + cat.userCount,
                          0
                        )}{" "}
                        total)
                      </Label>
                    </div>

                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`category-${category._id}`}
                          checked={formData.recipients.includes(
                            `category:${category.name}`
                          )}
                          onChange={(e) =>
                            handleRecipientChange(
                              `category:${category.name}`,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor={`category-${category._id}`}
                          className="flex items-center gap-2"
                        >
                          <Badge variant="secondary">{category.name}</Badge>
                          <span className="text-muted-foreground">
                            ({category.userCount} users)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>

                  {formData.recipients.length > 0 && (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Selected recipients: {getTotalRecipients()} users
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        {editingCampaign ? "Update Campaign" : "Save Campaign"}
                      </>
                    )}
                  </Button>

                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>

              {gmailConfigs.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      No Gmail configurations found. Please{" "}
                      <a 
                        href="/dashboard/gmail-configs" 
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        add at least one Gmail configuration
                      </a>{" "}
                      to create campaigns.
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchData}
                      className="ml-4"
                    >
                      Refresh
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Email Preview Modal */}
      <EmailPreview />
    </div>
  );
}
