import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";

import { categoryAPI } from "@/utils/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    name: "",
  });


  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryAPI.getWithTotal();
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error("Failed to load categories"+err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingCategory(null);
    setName("");
    setOpenModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setOpenModal(true);
  };

  const saveCategory = async () => {
    if (!name.trim()) return toast.error("Category name is required");

    setSaving(true);
    const loadingToast = toast.loading("Saving...");

    try {
      const token = localStorage.getItem("adminToken");

      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, { name }, token);
      } else {
        await categoryAPI.create({ name }, token);
      }

      toast.success("Category saved", { id: loadingToast });
      setOpenModal(false);
      loadCategories();
    } catch (err) {
      toast.error("Failed to save category"+err, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (cat) => {
    setDeleteDialog({ open: true, id: cat.id, name: cat.name });
  };

  const deleteCategory = async () => {
    const loadingToast = toast.loading("Deleting...");

    try {
      const token = localStorage.getItem("adminToken");
      await categoryAPI.delete(deleteDialog.id, token);

      toast.success("Category deleted", { id: loadingToast });
      setDeleteDialog({ open: false, id: null, name: "" });
      loadCategories();
    } catch (err) {
      toast.error("Failed to delete category"+err, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
           
            Manage Categories
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Add, edit and organize project categories
          </p>
        </div>

        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90">
          <Icon icon="mdi:plus" className="w-5 h-5 mr-1" />
          Add Category
        </Button>
      </div>

      {/* Category Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="large" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-neutral-500 py-12">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-primary/60 transition rounded-xl"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {cat.name}

                  <span className="text-xs bg-primary/30 text-primary-light px-2 py-1 rounded">
                    {cat.total_projects} Projects
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex justify-between items-center pt-2">
                <Button
                  size="sm"
                  onClick={() => openEdit(cat)}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white"
                >
                  <Icon icon="mdi:pencil" className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => confirmDelete(cat)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Icon icon="mdi:delete" className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <label className="text-neutral-300 text-sm">Category Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
              placeholder="e.g., Mobile App, UI/UX, Backend"
            />
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setOpenModal(false)}
              className="bg-neutral-700 hover:bg-neutral-600 text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={saveCategory}
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) =>
        setDeleteDialog((prev) => ({ ...prev, open }))
      }>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to delete{" "}
              <span className="text-red-400 font-semibold">
                {deleteDialog.name}
              </span>
              ? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-700 hover:bg-neutral-600 text-white">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={deleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
