import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast, { Toaster } from "react-hot-toast";

import { portfolioAPI, categoryAPI } from "@/utils/api";
import { ROUTES } from "@/constants/RoutesContants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToParentElement,
  restrictToWindowEdges,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";

import { CSS } from "@dnd-kit/utilities";
import Cropper from "react-easy-crop";
import ImagePreviewDialog from "@/components/ImagePreviewDialog";
import ImageCropDialog from "@/components/ImageCropDialog";
import { convertToWebP } from "@/utils/convertToWebP";

/* =============== SORTABLE DESCRIPTION ITEM =============== */
function SortableDescriptionItem({
  id,
  description,
  index,
  onUpdate,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id,
      animateLayoutChanges: () => true,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 0ms" : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 p-3 bg-neutral-800 rounded-lg border border-neutral-700"
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-2 cursor-grab active:cursor-grabbing bg-neutral-700 hover:bg-neutral-600 px-2 py-1 rounded transition-colors"
        title="Drag to reorder"
      >
        <Icon icon="mdi:drag" className="w-4 h-4 text-white" />
      </button>

      <Textarea
        value={description}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="flex-1 bg-neutral-900 border-neutral-700 text-white resize-none focus:border-primary"
        rows={4}
        placeholder="Enter description paragraph..."
      />

      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(index)}
        className="shrink-0"
        title="Delete paragraph"
      >
        <Icon icon="mdi:delete" className="w-4 h-4" />
      </Button>
    </div>
  );
}

/* =============== SORTABLE IMAGE ITEM (HORIZONTAL DRAG) =============== */
function SortableImageItem({ id, image, index, onDelete, onPreview }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id,
      animateLayoutChanges: () => false,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 0ms" : undefined,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 hover:border-primary/80 cursor-pointer"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80 p-1.5 rounded transition-opacity"
        title="Drag to reorder"
      >
        <Icon icon="mdi:drag" className="w-4 h-4 text-white" />
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-red-500/80 hover:bg-red-600 p-1.5 rounded transition-opacity"
        title="Delete image"
      >
        <Icon icon="mdi:delete" className="w-4 h-4 text-white" />
      </button>

      <img
        src={image.image_url || image}
        alt={image.alt_text || `Screenshot ${index + 1}`}
        onClick={() => onPreview(image.image_url || image)}
        className="w-full h-40 object-cover select-none"
        draggable={false}
      />

      <div className="absolute bottom-1 right-2 text-xs bg-black/65 text-white px-2 py-0.5 rounded">
        #{index + 1}
      </div>
    </div>
  );
}

/* ======================= MAIN COMPONENT ======================= */
export default function ViewEditPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const headerImageInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [slugLocked, setSlugLocked] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);

  const [cropDialog, setCropDialog] = useState({
    isOpen: false,
    imageSrc: null,
    type: null, // 'header' | 'screenshot'
  });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    publisher_name: "",
    project_link: "",
    header_image_url: "",
    selectedCategories: [],
    descriptions: [],
    images: [],
  });

  const [initialFormData, setInitialFormData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* ---------- Load data ---------- */
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [portfolioRes, categoryRes] = await Promise.all([
        portfolioAPI.getById(id),
        categoryAPI.getAll(),
      ]);

      const portfolioData = portfolioRes.data.portfolio;

      const initial = {
        title: portfolioData.title || "",
        slug: portfolioData.slug || "",
        publisher_name: portfolioData.publisher_name || "",
        project_link: portfolioData.project_link || "",
        header_image_url: portfolioData.header_image_url || "",
        selectedCategories: portfolioData.categories?.map((c) => c.id) || [],
        descriptions: portfolioData.descriptions || [],
        images: portfolioData.images || [],
      };

      setCategories(categoryRes.data.categories || []);
      setFormData(initial);
      setInitialFormData(JSON.parse(JSON.stringify(initial)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Detect unsaved changes ---------- */
  useEffect(() => {
    if (initialFormData) {
      const changed =
        JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasUnsavedChanges(changed);
    }
  }, [formData, initialFormData]);

  /* ---------- Warn on browser close ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  /* ---------- Handlers ---------- */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
  };

  // Descriptions
  const handleDescriptionUpdate = (index, value) => {
    setFormData((prev) => {
      const copy = [...prev.descriptions];
      copy[index] = value;
      return { ...prev, descriptions: copy };
    });
  };

  const handleAddDescription = () => {
    setFormData((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, ""],
    }));
  };

  const handleDeleteDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  };

  const handleDescriptionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.descriptions.findIndex(
      (_, i) => `desc-${i}` === active.id
    );
    const newIndex = formData.descriptions.findIndex(
      (_, i) => `desc-${i}` === over.id
    );

    setFormData((prev) => ({
      ...prev,
      descriptions: arrayMove(prev.descriptions, oldIndex, newIndex),
    }));
  };

  // Screenshots
  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.images.findIndex(
      (_, i) => `img-${i}` === active.id
    );
    const newIndex = formData.images.findIndex(
      (_, i) => `img-${i}` === over.id
    );

    setFormData((prev) => ({
      ...prev,
      images: arrayMove(prev.images, oldIndex, newIndex),
    }));
  };

  // Header image change
  const handleHeaderImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropDialog({
        isOpen: true,
        imageSrc: event.target.result,
        type: "header",
      });
    };
    reader.readAsDataURL(file);
  };

  // Screenshot upload
  const handleScreenshotImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropDialog({
        isOpen: true,
        imageSrc: event.target.result,
        type: "screenshot",
      });
    };
    reader.readAsDataURL(file);
  };

  // Crop callback
  const handleCropComplete = (croppedImageUrl) => {
    if (cropDialog.type === "header") {
      setFormData((prev) => ({
        ...prev,
        header_image_url: croppedImageUrl,
      }));
      toast.success("Header image updated");
    } else if (cropDialog.type === "screenshot") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { image_url: croppedImageUrl, alt_text: "" }],
      }));
      toast.success("Screenshot added");
    }

    setCropDialog({ isOpen: false, imageSrc: null, type: null });
  };

  const handleAddScreenshot = () => {
    screenshotInputRef.current?.click();
  };


  

  const handleSave = async () => {
  if (!formData.title.trim()) {
    toast.error("Project title is required");
    return;
  }
  if (!formData.slug.trim()) {
    toast.error("Slug is required");
    return;
  }
  if (formData.selectedCategories.length === 0) {
    toast.error("Please select at least one category");
    return;
  }

  setSaving(true);
  const loadingToast = toast.loading("Compressing & uploading images...");

  try {
    const tech_category = JSON.stringify(
      formData.selectedCategories
        .map((catId) => categories.find((c) => c.id === catId)?.slug)
        .filter(Boolean)
    );

    // Convert images to WebP
    const convertedImages = await Promise.all(
      formData.images.map(async (img, index) => {
        const response = await fetch(img.image_url);
        const blob = await response.blob();
        return await convertToWebP(blob, id, index);
      })
    );

    // FormData payload
    const form = new FormData();
    form.append("title", formData.title);
    form.append("slug", formData.slug);
    form.append("publisher_name", formData.publisher_name);
    form.append("project_link", formData.project_link);
    form.append("header_image_url", formData.header_image_url);
    form.append("tech_category", tech_category);
    form.append("descriptions", JSON.stringify(formData.descriptions));

    convertedImages.forEach((file) => {
      form.append("images", file);
    });

    // 👇 Get token stored locally
    const token = localStorage.getItem("adminToken");

    // 👇 Send request with Token Auth header
    await portfolioAPI.update(id, form,token);

    toast.success("Portfolio updated successfully", { id: loadingToast });

    setInitialFormData(JSON.parse(JSON.stringify(formData)));
    setHasUnsavedChanges(false);

    setTimeout(() => {
      navigate(ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO);
    }, 800);

  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to update portfolio", {
      id: loadingToast,
    });
  } finally {
    setSaving(false);
  }
};



  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowNavigationWarning(true);
    } else {
      navigate(ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO);
    }
  };

  const handleDiscardChanges = () => {
    setShowNavigationWarning(false);
    setHasUnsavedChanges(false);
    navigate(ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO);
  };

  const handleCancelNavigation = () => {
    setShowNavigationWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#262626",
            color: "#fff",
            border: "1px solid #404040",
          },
        }}
      />

      {/* Navigation Warning Dialog */}
      <AlertDialog
        open={showNavigationWarning}
        onOpenChange={setShowNavigationWarning}
      >
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              You have unsaved changes. Are you sure you want to leave? All
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelNavigation}
              className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700"
            >
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardChanges}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Crop Dialog */}
      <ImageCropDialog
        isOpen={cropDialog.isOpen}
        onClose={() =>
          setCropDialog({ isOpen: false, imageSrc: null, type: null })
        }
        imageSrc={cropDialog.imageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={3 / 2}
      />

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
      />

      {/* Hidden file inputs */}
      <input
        ref={headerImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleHeaderImageChange}
        className="hidden"
      />
      <input
        ref={screenshotInputRef}
        type="file"
        accept="image/*"
        onChange={handleScreenshotImageChange}
        className="hidden"
      />

      <div className="min-h-screen bg-neutral-950">
        {/* Header Bar */}
        <div className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800">
          <div className="px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <Icon icon="mdi:arrow-left" className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Edit Portfolio
                </h1>
                <p className="text-neutral-400 text-sm">
                  Update project details and content
                  {hasUnsavedChanges && (
                    <span className="ml-2 text-amber-400">
                      • Unsaved changes
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
            
              <Button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:content-save" className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Basic Information */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon
                    icon="mdi:information"
                    className="w-5 h-5 text-primary"
                  />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-neutral-300 mb-1.5 block">
                      Project Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange("title", value);
                        if (!slugLocked) {
                          const autoSlug = value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                          handleInputChange("slug", autoSlug);
                        }
                      }}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-1.5 block">
                      URL Slug <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => {
                        setSlugLocked(true);
                        handleInputChange("slug", e.target.value);
                      }}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="project-slug"
                      disabled
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-1.5 block">
                      Publisher / Company
                    </Label>
                    <Input
                      value={formData.publisher_name}
                      onChange={(e) =>
                        handleInputChange("publisher_name", e.target.value)
                      }
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-1.5 block">
                      Project URL
                    </Label>
                    <Input
                      type="url"
                      value={formData.project_link}
                      onChange={(e) =>
                        handleInputChange("project_link", e.target.value)
                      }
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Header Image */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon icon="mdi:image" className="w-5 h-5 text-primary" />
                  Header Image (3:2 Ratio)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {formData.header_image_url ? (
                  <div className="relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 aspect-[3/2] max-w-3xl mx-auto">
                    <img
                      src={formData.header_image_url}
                      alt={formData.title || "Header preview"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button
                        onClick={() => headerImageInputRef.current?.click()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Icon icon="mdi:image-edit" className="w-5 h-5 mr-2" />
                        Change Image
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleInputChange("header_image_url", "")
                        }
                      >
                        <Icon icon="mdi:delete" className="w-5 h-5 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => headerImageInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-neutral-800/50 transition-all aspect-[3/2] max-w-3xl mx-auto flex flex-col items-center justify-center"
                  >
                    <Icon
                      icon="mdi:cloud-upload"
                      className="w-16 h-16 text-neutral-600 mb-4"
                    />
                    <p className="text-neutral-400 text-sm mb-2">
                      Click to upload header image
                    </p>
                    <p className="text-neutral-500 text-xs">
                      Image will be cropped to 3:2 ratio
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon
                    icon="mdi:tag-multiple"
                    className="w-5 h-5 text-primary"
                  />
                  Technology Categories{" "}
                  <span className="text-red-400 text-sm ml-1">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-primary/80 transition-colors"
                    >
                      <Checkbox
                        checked={formData.selectedCategories.includes(
                          category.id
                        )}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.id)
                        }
                        className="border-neutral-600"
                      />
                      <span className="text-neutral-300 text-sm capitalize">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
                {formData.selectedCategories.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-neutral-800 text-neutral-400 text-sm">
                    {formData.selectedCategories.length} categor
                    {formData.selectedCategories.length === 1
                      ? "y"
                      : "ies"}{" "}
                    selected
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Descriptions */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800 flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon
                    icon="mdi:text-box-multiple"
                    className="w-5 h-5 text-primary"
                  />
                  Project Descriptions
                </CardTitle>
                <Button
                  size="sm"
                  onClick={handleAddDescription}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-1" />
                  Add Paragraph
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDescriptionDragEnd}
                  modifiers={[restrictToParentElement, restrictToWindowEdges]}
                >
                  <SortableContext
                    items={formData.descriptions.map((_, i) => `desc-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {formData.descriptions.map((desc, index) => (
                        <SortableDescriptionItem
                          key={`desc-${index}`}
                          id={`desc-${index}`}
                          description={desc}
                          index={index}
                          onUpdate={handleDescriptionUpdate}
                          onDelete={handleDeleteDescription}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {formData.descriptions.length === 0 && (
                  <div className="text-center py-12 bg-neutral-800 rounded-lg border border-neutral-700 mt-4">
                    <Icon
                      icon="mdi:text-box-outline"
                      className="w-12 h-12 text-neutral-600 mx-auto mb-3"
                    />
                    <p className="text-neutral-400 text-sm">
                      No descriptions added yet
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                      Click "Add Paragraph" to create content
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Screenshots */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800 flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon
                    icon="mdi:image-multiple"
                    className="w-5 h-5 text-primary"
                  />
                  Project Screenshots (drag horizontally)
                </CardTitle>
                <Button
                  size="sm"
                  onClick={handleAddScreenshot}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-1" />
                  Add Screenshot
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleImageDragEnd}
                  modifiers={[
                    restrictToParentElement,
                    restrictToHorizontalAxis,
                    restrictToWindowEdges,
                  ]}
                >
                  <SortableContext
                    items={formData.images.map((_, i) => `img-${i}`)}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
                      {formData.images.map((image, index) => (
                        <SortableImageItem
                          key={`img-${index}`}
                          id={`img-${index}`}
                          image={image}
                          index={index}
                          onDelete={handleDeleteImage}
                          onPreview={(url) => setPreviewImage(url)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {formData.images.length === 0 && (
                  <div className="text-center py-12 bg-neutral-800 rounded-lg border border-neutral-700 mt-4">
                    <Icon
                      icon="mdi:image-off"
                      className="w-12 h-12 text-neutral-600 mx-auto mb-3"
                    />
                    <p className="text-neutral-400 text-sm">
                      No project screenshots added yet
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                      Click "Add Screenshot" to upload images
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
