"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { categoryAPI } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { CategoryModal } from "@/components/modals/category-modal"
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog"
import { useSession } from "next-auth/react"

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data: session } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("No token")
      const response = await categoryAPI.getCategories(session?.accessToken)
      return response.data.data
    },
    enabled: !!session?.accessToken,
  })

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (!session?.accessToken) throw new Error("No token")
      return categoryAPI.createCategory(formData, session?.accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category created successfully")
      setShowModal(false)
    },
    onError: () => {
      toast.error("Failed to create category")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      if (!session?.accessToken) throw new Error("No token")
      return categoryAPI.updateCategory(id, formData, session?.accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category updated successfully")
      setShowModal(false)
      setEditingCategory(null)
    },
    onError: () => {
      toast.error("Failed to update category")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!session?.accessToken) throw new Error("No token")
      return categoryAPI.deleteCategory(id, session?.accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Category deleted successfully")
      setDeleteId(null)
    },
    onError: () => {
      toast.error("Failed to delete category")
    },
  })

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleSaveCategory = (formData: FormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDeleteCategory = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <div>
      <Header title="Categories List" breadcrumbs={[{ label: "Dashboard" }, { label: "Categories" }]} />

      <div className="p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Categories</CardTitle>
            <Button onClick={handleAddCategory} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add Categories
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Item Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Brand</th>
                      <th className="text-left py-3 px-4 font-semibold">Colors</th>
                      <th className="text-left py-3 px-4 font-semibold">Conditions</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data || []).map((category: any) => (
                      <tr key={category._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          {category.image && (
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          {category.name}
                        </td>
                        <td className="py-3 px-4">{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">04</td>
                        <td className="py-3 px-4">04</td>
                        <td className="py-3 px-4">04</td>
                        <td className="py-3 px-4">04</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(category._id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CategoryModal
        open={showModal}
        onOpenChange={setShowModal}
        onSave={handleSaveCategory}
        category={editingCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDeleteCategory(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
