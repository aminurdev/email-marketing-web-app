'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  Users, 
  Search, 
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  userCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    category: ''
  });
  const [addingUser, setAddingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, [fetchUsers]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    
    if (!uploadCategory) {
      toast.error('Category required', {
        description: 'Please select a category before uploading the CSV file.',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('category', uploadCategory);

      const response = await fetch('/api/users/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Upload completed successfully!', {
          description: `Processed: ${data.data.processed} users, Skipped: ${data.data.skipped} users`,
        });
        setShowUpload(false);
        setUploadFile(null);
        setUploadCategory('');
        fetchUsers();
        fetchCategories();
      } else {
        toast.error('Upload failed', {
          description: data.error,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed', {
        description: 'An error occurred while uploading the CSV file.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.category) {
      toast.error('Missing required fields', {
        description: 'Please fill in name, email, and category.',
      });
      return;
    }

    setAddingUser(true);
    try {
      const userData = {
        firstName: newUser.name.split(' ')[0],
        lastName: newUser.name.split(' ').slice(1).join(' ') || undefined,
        email: newUser.email,
        category: newUser.category
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('User added successfully!', {
          description: `${newUser.name} has been added to ${newUser.category} category.`,
        });
        setNewUser({ name: '', email: '', category: '' });
        fetchUsers();
        fetchCategories();
      } else {
        toast.error('Failed to add user', {
          description: data.error,
        });
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user', {
        description: 'An error occurred while adding the user.',
      });
    } finally {
      setAddingUser(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,email
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com
Bob Wilson,bob.wilson@example.com`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template downloaded', {
      description: 'CSV template has been downloaded to your computer.',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar Skeleton */}
            <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-300 rounded"></div>
                  <div className="w-16 h-6 bg-gray-300 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
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
              <Users className="h-5 w-5 text-white" />
            </div>
            User Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your email recipients and import from CSV files
          </p>
        </div>
        <Button 
          onClick={() => setShowUpload(!showUpload)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload CSV
        </Button>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              User Database
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                {users.length} users loaded
              </span>
            </div>
          </div>
          <CardDescription className="text-base mt-2">
            Manage individual users and bulk import from CSV files
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {/* User Management Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Add Single User */}
            <Card className="border-green-200 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100">
                <CardTitle className="text-lg flex items-center gap-3 text-green-800">
                  <div className="w-7 h-7 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  Add Individual User
                </CardTitle>
                <CardDescription className="text-green-700">
                  Quickly add a single user to your database
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="userName"
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userCategory" className="text-sm font-medium">Category *</Label>
                    <Select value={newUser.category} onValueChange={(value) => setNewUser({ ...newUser, category: value })}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="submit" 
                      disabled={addingUser}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {addingUser ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setNewUser({ name: '', email: '', category: '' })}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Bulk Upload */}
            <Card className="border-blue-200 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100">
                <CardTitle className="text-lg flex items-center gap-3 text-blue-800">
                  <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  Bulk Upload CSV
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Import multiple users from a CSV file
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload a CSV file with name and email columns
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Format: name,email (with headers)
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Download Template
                      </Button>
                      <Button
                        onClick={() => setShowUpload(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {showUpload && (
            <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
              <Card className="border-blue-200 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100">
                  <CardTitle className="text-lg flex items-center gap-3 text-blue-800">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                    Upload Users from CSV
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Import multiple users at once - all will be assigned to one category
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                        <Select value={uploadCategory} onValueChange={setUploadCategory}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Choose category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category._id} value={category.name}>
                                {category.name} ({category.userCount} users)
                              </SelectItem>
                            ))}
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="csvFile" className="text-sm font-medium">CSV File *</Label>
                        <Input
                          id="csvFile"
                          type="file"
                          accept=".csv"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          required
                          className="h-10"
                        />
                      </div>
                    </div>

                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <div className="space-y-2">
                          <p className="font-medium">CSV Format Requirements:</p>
                          <div className="bg-white p-3 rounded border text-sm font-mono">
                            name,email<br />
                            John Doe,john@example.com<br />
                            Jane Smith,jane@example.com
                          </div>
                          <p className="text-xs">
                            • First row must contain headers: <code>name,email</code><br />
                            • Each row should have a name and valid email address
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        disabled={uploading || !uploadCategory || !uploadFile}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Users
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowUpload(false);
                          setUploadFile(null);
                          setUploadCategory('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-6">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                    />
                  </div>
                  <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-full sm:w-[200px] h-10 border-gray-200">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {category.userCount}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200 h-12">
                      <TableHead className="font-semibold text-gray-900">User</TableHead>
                      <TableHead className="font-semibold text-gray-900">Category</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow 
                        key={user._id} 
                        className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName || user.lastName 
                                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                  : 'N/A'
                                }
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge 
                            variant="secondary" 
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {user.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge 
                            variant={user.isActive ? "default" : "secondary"}
                            className={user.isActive 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-gray-100 text-gray-600 border-gray-200"
                            }
                          >
                            {user.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 mr-1 rounded-full bg-gray-400"></div>
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-gray-500">
                          <div className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="py-12">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-base font-medium mb-1 text-gray-900">No users found</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              {searchTerm || selectedCategory 
                                ? "No users match your current filters."
                                : "Add users individually or upload a CSV file to get started."
                              }
                            </p>
                            {!searchTerm && !selectedCategory && (
                              <Button 
                                onClick={() => setShowUpload(true)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload CSV
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}