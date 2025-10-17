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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Settings,
  Play,
} from "lucide-react";
import { toast } from "sonner";

interface MigrationStatus {
  userEmailIndexes: {
    isCorrect: boolean;
    message: string;
  };
  gmailConfigIndexes: {
    isCorrect: boolean;
    message: string;
  };
  categoryStatus: {
    isCorrect: boolean;
    message: string;
  };
  gmailConfigStatus: {
    isCorrect: boolean;
    message: string;
  };
}

interface MigrationResult {
  name: string;
  success: boolean;
  message: string;
  actions: string[];
  error?: string;
}

export default function DatabasePage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);
  const [needsMigration, setNeedsMigration] = useState(false);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database/migrate');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.status);
        setNeedsMigration(data.needsMigration);
      } else {
        toast.error("Failed to check migration status", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to check migration status:", error);
      toast.error("Failed to check migration status", {
        description: "Network error occurred while checking database status.",
      });
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    setMigrating(true);
    const loadingToast = toast.loading("Running database migration...", {
      description: "Please wait while we update your database structure.",
    });

    try {
      const response = await fetch('/api/database/migrate', {
        method: 'POST',
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        setMigrationResults(data.results);
        toast.success("Database migration completed!", {
          description: `${data.summary.successful}/${data.summary.total} migrations successful.`,
        });
        
        // Refresh status after migration
        await checkMigrationStatus();
      } else {
        toast.error("Migration failed", {
          description: data.error,
        });
        setMigrationResults(data.results || []);
      }
    } catch (error) {
      console.error("Migration failed:", error);
      toast.dismiss(loadingToast);
      toast.error("Migration failed", {
        description: "An error occurred while running the migration.",
      });
    } finally {
      setMigrating(false);
    }
  };

  const getStatusIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusBadge = (isCorrect: boolean) => {
    return (
      <Badge variant={isCorrect ? "default" : "destructive"}>
        {isCorrect ? "OK" : "Needs Migration"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-64 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
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
              <Database className="h-5 w-5 text-white" />
            </div>
            Database Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor and manage your database structure and migrations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={checkMigrationStatus}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          {needsMigration && (
            <Button
              onClick={runMigration}
              disabled={migrating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              {migrating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Migration
            </Button>
          )}
        </div>
      </div>

      {/* Migration Status Overview */}
      {needsMigration && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p className="font-medium">Database Migration Required</p>
              <p className="text-sm">
                Your database structure needs to be updated to support the latest features. 
                Click "Run Migration" to update your database safely.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Migration Status Details */}
      <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            Migration Status
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Current status of database structure and required migrations
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {status && (
            <div className="space-y-4">
              {/* User Email Indexes */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.userEmailIndexes.isCorrect)}
                  <div>
                    <h3 className="font-medium">User Email Indexes</h3>
                    <p className="text-sm text-muted-foreground">
                      {status.userEmailIndexes.message}
                    </p>
                  </div>
                </div>
                {getStatusBadge(status.userEmailIndexes.isCorrect)}
              </div>

              {/* Gmail Config Indexes */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.gmailConfigIndexes.isCorrect)}
                  <div>
                    <h3 className="font-medium">Gmail Config Indexes</h3>
                    <p className="text-sm text-muted-foreground">
                      {status.gmailConfigIndexes.message}
                    </p>
                  </div>
                </div>
                {getStatusBadge(status.gmailConfigIndexes.isCorrect)}
              </div>

              {/* Category Status Fields */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.categoryStatus.isCorrect)}
                  <div>
                    <h3 className="font-medium">Category Status Fields</h3>
                    <p className="text-sm text-muted-foreground">
                      {status.categoryStatus.message}
                    </p>
                  </div>
                </div>
                {getStatusBadge(status.categoryStatus.isCorrect)}
              </div>

              {/* Gmail Config Status Fields */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.gmailConfigStatus.isCorrect)}
                  <div>
                    <h3 className="font-medium">Gmail Config Status Fields</h3>
                    <p className="text-sm text-muted-foreground">
                      {status.gmailConfigStatus.message}
                    </p>
                  </div>
                </div>
                {getStatusBadge(status.gmailConfigStatus.isCorrect)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migration Results */}
      {migrationResults.length > 0 && (
        <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-gray-100 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-white" />
              </div>
              Migration Results
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Results from the last migration run
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {migrationResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      {result.name}
                    </h3>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {result.message}
                  </p>
                  
                  {result.error && (
                    <p className="text-sm text-red-600 mb-2">
                      Error: {result.error}
                    </p>
                  )}
                  
                  {result.actions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Actions:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {result.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">About Database Migrations</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  Database migrations ensure your database structure is up-to-date with the latest application features:
                </p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>User Email Indexes:</strong> Allows same email in different categories</li>
                  <li>• <strong>Gmail Config Indexes:</strong> Enables email reuse after soft delete</li>
                  <li>• <strong>Status Fields:</strong> Adds soft delete capabilities to categories and configs</li>
                </ul>
                <p className="mt-3">
                  Migrations are safe to run multiple times and will only make necessary changes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}