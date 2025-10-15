"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Tags, 
  Plus, 
  Users, 
  Calendar, 
  Palette,
  Loader2,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Eye
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  description?: string;
  color: string;
  userCount: number;
  createdAt: string;
}

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [selectedCategoryUsers, setSelectedCategoryUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    const isEditing = editingCategory !== null;
    const loadingToast = toast.loading(
      isEditing ? "Updating category..." : "Creating category...", 
      {
        description: `Please wait while we ${isEditing ? 'update' : 'create'} your category.`,
      }
    );

    try {
      const url = isEditing ? `/api/categories/${editingCategory._id}` : "/api/categories";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        if (isEditing) {
          setCategories(categories.map(cat => 
            cat._id === editingCategory._id ? data.data : cat
          ));
          toast.success("Category updated successfully!", {
            description: `"${data.data.name}" category has been updated.`,
          });
        } else {
          setCategories([...categories, data.data]);
          toast.success("Category created successfully!", {
            description: `"${data.data.name}" category has been added.`,
          });
        }
        
        setFormData({ name: "", description: "", color: "#3B82F6" });
        setShowForm(false);
        setEditingCategory(null);
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} category`, {
          description: data.error,
        });
      }
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} category:`, error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} category`, {
        description: "An error occurred while processing your request.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    const loadingToast = toast.loading("Deleting category...", {
      description: "Please wait while we delete the category.",
    });

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        setCategories(categories.filter(cat => cat._id !== categoryId));
        toast.success("Category deleted successfully!", {
          description: `"${categoryName}" category has been removed.`,
        });
      } else {
        toast.error("Failed to delete category", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete category", {
        description: "An error occurred while deleting the category.",
      });
    }
  };

  const navigateToUsersWithCategory = (categoryName: string) => {
    router.push(`/dashboard/users?category=${encodeURIComponent(categoryName)}`);
  };

  // Keep the original function for potential future use (modal view)
  // const fetchCategoryUsers = async (category: Category) => {
  //   setSelectedCategory(category);
  //   setLoadingUsers(true);
  //   setShowUsersDialog(true);

  //   try {
  //     const response = await fetch(`/api/users?category=${encodeURIComponent(category.name)}`);
  //     const data = await response.json();
      
  //     if (data.success) {
  //       setSelectedCategoryUsers(data.data);
  //     } else {
  //       toast.error("Failed to fetch users", {
  //         description: data.error,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch category users:", error);
  //     toast.error("Failed to fetch users", {
  //       description: "An error occurred while fetching users.",
  //     });
  //   } finally {
  //     setLoadingUsers(false);
  //   }
  // };

  const colorOptions = [
    { value: "#3B82F6", name: "Blue", class: "bg-blue-500" },
    { value: "#10B981", name: "Green", class: "bg-green-500" },
    { value: "#F59E0B", name: "Yellow", class: "bg-yellow-500" },
    { value: "#EF4444", name: "Red", class: "bg-red-500" },
    { value: "#8B5CF6", name: "Purple", class: "bg-purple-500" },
    { value: "#06B6D4", name: "Cyan", class: "bg-cyan-500" },
    { value: "#84CC16", name: "Lime", class: "bg-lime-500" },
    { value: "#F97316", name: "Orange", class: "bg-orange-500" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Categories Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              <Tags className="h-5 w-5 text-white" />
            </div>
            Categories
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Organize your users into different categories for targeted campaigns
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="border-0 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-100 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Tags className="h-4 w-4 text-white" />
                </div>
                User Categories
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Organize and manage your user segments for targeted campaigns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{categories.length} categories</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-blue-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Categories</p>
                    <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Tags className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-green-600">
                      {categories.reduce((sum, cat) => sum + cat.userCount, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg per Category</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {categories.length > 0 
                        ? Math.round(categories.reduce((sum, cat) => sum + cat.userCount, 0) / categories.length)
                        : 0
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {showForm && (
            <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
              <Card className="border-blue-200 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-blue-100">
                  <CardTitle className="text-lg flex items-center gap-3 text-blue-800">
                    <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      {editingCategory ? <Edit className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
                    </div>
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    {editingCategory 
                      ? "Update the category details below" 
                      : "Add a new category to organize your users effectively"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Category Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g., Customers, Prospects, Partners..."
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color" className="text-sm font-medium flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Category Color
                        </Label>
                        <Select
                          value={formData.color}
                          onValueChange={(value) =>
                            setFormData({ ...formData, color: value })
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full ${color.class}`}
                                  />
                                  {color.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe what this category represents..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        type="submit" 
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {editingCategory ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            {editingCategory ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {editingCategory ? "Update Category" : "Create Category"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setEditingCategory(null);
                          setFormData({ name: "", description: "", color: "#3B82F6" });
                        }}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="hover:shadow-lg transition-all duration-200 border-gray-200 group hover:border-gray-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Category Header */}
                  <div 
                    className="h-2 w-full"
                    style={{ backgroundColor: category.color }}
                  />
                  
                  <div className="p-6">
                    {/* Category Title */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => navigateToUsersWithCategory(category.name)}
                          title="View users in this category"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(category)}
                          title="Edit category"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              title="Delete category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone.
                                {category.userCount > 0 && (
                                  <span className="block mt-2 text-red-600 font-medium">
                                    Warning: This category contains {category.userCount} users. They will need to be reassigned to other categories.
                                  </span>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category._id, category.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Category
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Description */}
                    {category.description ? (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-4 italic">
                        No description provided
                      </p>
                    )}

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{category.userCount}</p>
                            <p className="text-xs text-muted-foreground">Users</p>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          <Target className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(category.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full">
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tags className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      No categories yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Categories help you organize users into targeted groups for more effective email campaigns. Create your first category to get started.
                    </p>
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Category
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Dialog */}
      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users in "{selectedCategory?.name}" Category
            </DialogTitle>
            <DialogDescription>
              Manage users in this category. You can delete individual users or select multiple users for bulk operations.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {loadingUsers ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-6 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : selectedCategoryUsers.length > 0 ? (
              <CategoryUsersTable 
                users={selectedCategoryUsers}
                onUsersUpdate={(updatedUsers) => {
                  setSelectedCategoryUsers(updatedUsers);
                  // Update the category user count
                  if (selectedCategory) {
                    setCategories(categories.map(cat => 
                      cat._id === selectedCategory._id 
                        ? { ...cat, userCount: updatedUsers.length }
                        : cat
                    ));
                  }
                }}
              />
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-gray-500">
                  This category doesn't have any users yet.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Category Users Table Component
function CategoryUsersTable({ 
  users, 
  onUsersUpdate 
}: { 
  users: User[];
  onUsersUpdate: (users: User[]) => void;
}) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const loadingToast = toast.loading("Deleting user...", {
      description: "Please wait while we delete the user.",
    });

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        const updatedUsers = users.filter(user => user._id !== userId);
        onUsersUpdate(updatedUsers);
        toast.success("User deleted successfully!", {
          description: `${userName} has been removed.`,
        });
      } else {
        toast.error("Failed to delete user", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete user", {
        description: "An error occurred while deleting the user.",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    setDeleting(true);
    const loadingToast = toast.loading(`Deleting ${selectedUsers.length} users...`, {
      description: "Please wait while we delete the selected users.",
    });

    try {
      const response = await fetch('/api/users/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        const updatedUsers = users.filter(user => !selectedUsers.includes(user._id));
        onUsersUpdate(updatedUsers);
        setSelectedUsers([]);
        toast.success("Users deleted successfully!", {
          description: `${selectedUsers.length} users have been removed.`,
        });
      } else {
        toast.error("Failed to delete users", {
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Failed to bulk delete users:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete users", {
        description: "An error occurred while deleting the users.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedUsers.length} selected
            </Badge>
            <span className="text-sm text-blue-700">
              {selectedUsers.length === 1 ? '1 user selected' : `${selectedUsers.length} users selected`}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUsers([])}
            >
              Clear Selection
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Selected Users</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedUsers.length} selected users? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Users
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {user.firstName || user.lastName 
                          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                          : 'N/A'
                        }
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.isActive ? "default" : "secondary"}
                    className={user.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-gray-100 text-gray-600 border-gray-200"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{user.firstName || user.lastName 
                            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                            : user.email
                          }"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(
                            user._id, 
                            user.firstName || user.lastName 
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                              : user.email
                          )}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
