import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import ImagePreviewDialog from "@/components/ImagePreviewDialog";
import ImageCropDialog from "@/components/ImageCropDialog";
import { convertToWebP } from "@/utils/convertToWebP";
import { ICON_ASSETS } from "@/constants/IconConstant";

/* =============== SORTABLE DESCRIPTION ITEM =============== */
function SortableDescriptionItem({
  id,
  description,
  index,
  onUpdate,
  onDelete,
  descriptionCount
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
        <Icon icon={ICON_ASSETS.DRAG} className="w-4 h-4 text-white" />
      </button>

      <Textarea
        value={description}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="flex-1 bg-neutral-900 border-neutral-700 text-white resize-none focus:border-primary"
        rows={4}
        placeholder="Enter description paragraph..."
      />

      {/** Hide delete button if total descriptions <= 2 */}
{onDelete && descriptionCount > 2 && (
  <Button
    variant="destructive"
    size="icon"
    onClick={() => onDelete(index)}
    className="shrink-0"
    title="Delete paragraph"
  >
    <Icon icon={ICON_ASSETS.DELETE} className="w-4 h-4" />
  </Button>
)}

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

  const safePreview = () => {
    const url = image.image_url || image;
    if (url && typeof url === "string" && url.trim() !== "") {
      onPreview(url);
    }
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
        <Icon icon={ICON_ASSETS.DRAG} className="w-4 h-4 text-white" />
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
        <Icon icon={ICON_ASSETS.DELETE} className="w-4 h-4 text-white" />
      </button>

      <img
        src={image.image_url || image}
        alt={image.alt_text || `Screenshot ${index + 1}`}
        onClick={safePreview}
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
export default function AdminAddPortfolioPage() {
  const navigate = useNavigate();

  const headerImageInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [previewImage, setPreviewImage] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

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
    project_type: "",
    selectedCategories: [],
    // Initialize with minimum 2 description fields
    descriptions: ["", ""],
    images: [],
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

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
    // Ensure minimum 2 fields remain
    setFormData((prev) => {
      const copy = prev.descriptions.filter((_, i) => i !== index);
      return { ...prev, descriptions: copy.length >= 2 ? copy : ["", ""] };
    });
  };

  const handleDescriptionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split("-")[1]);
    const newIndex = parseInt(over.id.split("-")[1]);

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

    const oldIndex = parseInt(active.id.split("-")[1]);
    const newIndex = parseInt(over.id.split("-")[1]);

    setFormData((prev) => ({
      ...prev,
      images: arrayMove(prev.images, oldIndex, newIndex),
    }));
  };

  const closeCropDialog = () => {
    // allow selecting same file again
    if (headerImageInputRef.current) headerImageInputRef.current.value = "";
    if (screenshotInputRef.current) screenshotInputRef.current.value = "";

    setCropDialog({ isOpen: false, imageSrc: null, type: null });
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
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

    // reset input so same file can be selected again
    e.target.value = "";
  };

  // Screenshot upload
  const handleScreenshotImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
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

    // allow re-selecting same file later
    e.target.value = "";
  };

  // Crop callback
  const handleCropComplete = (croppedImageUrl) => {
    if (cropDialog.type === "header") {
      setFormData((prev) => ({
        ...prev,
        header_image_url: croppedImageUrl,
      }));

      // reset input so selecting same image again triggers change
      if (headerImageInputRef.current) headerImageInputRef.current.value = "";

      toast.success("Header image updated");
    } else if (cropDialog.type === "screenshot") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, { image_url: croppedImageUrl, alt_text: "" }],
      }));

      // reset input so selecting same image again triggers change
      if (screenshotInputRef.current) screenshotInputRef.current.value = "";

      toast.success("Screenshot added");
    }

    closeCropDialog();
  };

  const handleAddScreenshot = () => {
    screenshotInputRef.current?.click();
  };

  const handleSave = () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!formData.project_type.trim()) {
      toast.error("Project type is required");
      return;
    }
    if (!formData.header_image_url) {
      toast.error("Header image is required");
      return;
    }
    if (formData.selectedCategories.length === 0) {
      toast.error("At least 1 category is required");
      return;
    }
    // ensure min 2 descriptions
    if (formData.descriptions.length < 2 || formData.descriptions.filter(Boolean).length < 2) {
      toast.error("At least 2 description paragraphs are required");
      return;
    }
    if (formData.images.length < 2) {
      toast.error("At least 2 screenshots are required");
      return;
    }

    // ✔ Open confirmation dialog
    setShowSaveConfirm(true);
  };

  const performSave = async () => {
    setShowSaveConfirm(false);
    setSaving(true);

    const loadingToast = toast.loading("Uploading images...");

    try {
      const tech_category = JSON.stringify(
        formData.selectedCategories
          .map((id) => categories.find((c) => c.id === id)?.slug)
          .filter(Boolean)
      );

      const images_meta = [];
      const filesToUpload = [];

      /* -----------------------------
         1) HEADER IMAGE (always new)
      ------------------------------ */
      const headerImg = formData.header_image_url;
      if (!headerImg) throw new Error("Header image required");

      // fetch header, convert to webp file
      const headerRes = await fetch(headerImg);
      const headerBlob = await headerRes.blob();
      const headerFile = await convertToWebP(headerBlob, `header_${Date.now()}.webp`);

      images_meta.push({
        image_url: null,
        isNew: true,
        fileIndex: filesToUpload.length,
      });
      filesToUpload.push(headerFile);

      /* -----------------------------
         2) SCREENSHOTS (IN ORDER) (always new)
      ------------------------------ */
      for (let i = 0; i < formData.images.length; i++) {
        const img = formData.images[i];
        const res = await fetch(img.image_url);
        const blob = await res.blob();
        const file = await convertToWebP(blob, `screenshot_${i}_${Date.now()}.webp`);

        images_meta.push({
          image_url: null,
          isNew: true,
          fileIndex: filesToUpload.length,
        });
        filesToUpload.push(file);
      }

      /* -----------------------------
         BUILD FORM DATA
      ------------------------------ */
      const form = new FormData();

      form.append("title", formData.title);
      form.append("slug", formData.slug);
      form.append("publisher_name", formData.publisher_name || "");
      form.append("project_link", formData.project_link || "");
      form.append("tech_category", tech_category);
      form.append("project_type", formData.project_type || "");
      form.append("descriptions", JSON.stringify(formData.descriptions));

      form.append("images_meta", JSON.stringify(images_meta));

      // append files with filename (important for multer)
      filesToUpload.forEach((file) => {
        form.append("images", file, file.name || `upload_${Date.now()}.webp`);
      });

      /* Debug: inspect form entries in console (optional)
         for (const pair of form.entries()) {
           console.log(pair[0], pair[1]);
         }
      */

      /* -----------------------------
         SEND CREATE TO BACKEND
      ------------------------------ */
      const token = localStorage.getItem("adminToken");
      await portfolioAPI.create(form, token);

      toast.success("Portfolio created successfully", { id: loadingToast });

      // go back to listing
      setTimeout(() => {
        navigate(ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO);
      }, 600);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create portfolio", {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
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

      {/* Save Confirm */}
      <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Create</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              Are you sure you want to create this portfolio?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 text-white hover:bg-neutral-700 border-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={performSave}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Create Portfolio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Crop Dialog */}
      <ImageCropDialog
        isOpen={cropDialog.isOpen}
        onClose={closeCropDialog}
        imageSrc={cropDialog.imageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={3 / 2}
      />

      {/* Preview Dialog */}
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
                onClick={() => navigate(ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO)}
                className="text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <Icon icon="mdi:arrow-left" className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Add Portfolio</h1>
                <p className="text-neutral-400 text-sm">Create a new project</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:plus" className="w-5 h-5 mr-2" />
                    Create Portfolio
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          <div className="space-y-6  mx-auto">
            {/* Basic Information */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon icon="mdi:information" className="w-5 h-5 text-primary" />
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
                        // auto slug
                        if (value) {
                          const autoSlug = value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                          handleInputChange("slug", autoSlug);
                        } else {
                          handleInputChange("slug", "");
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
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="project-slug"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-1.5 block gap-1">Project Type <span className="text-red-400">*</span></Label>
                    <Input
                      value={formData.project_type}
                      onChange={(e) => handleInputChange("project_type", e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="Project Type"
                    />
                  </div>
                  <div>
                    <Label className="text-neutral-300 mb-1.5 block">Publisher / Company</Label>
                    <Input
                      value={formData.publisher_name}
                      onChange={(e) => handleInputChange("publisher_name", e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="Company name"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <Label className="text-neutral-300 mb-1.5 block">Project URL <span className="text-red-400">*</span></Label>
                    <Input
                      type="url"
                      value={formData.project_link}
                      onChange={(e) => handleInputChange("project_link", e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon icon="mdi:tag-multiple" className="w-5 h-5 text-primary" />
                  Technology Categories <span className="text-red-400 text-sm ml-1">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-primary/80 transition-colors cursor-pointer"
                    >
                      <Checkbox
                        checked={formData.selectedCategories.includes(category.id)}
                        onCheckedChange={(e) => {
                          e.stopPropagation();
                          handleCategoryToggle(category.id);
                        }}
                        className="border-neutral-600"
                      />
                      <span className="text-neutral-300 text-sm capitalize">{category.name}</span>
                    </div>
                  ))}
                </div>
                {formData.selectedCategories.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-neutral-800 text-neutral-400 text-sm">
                    {formData.selectedCategories.length} categor
                    {formData.selectedCategories.length === 1 ? "y" : "ies"} selected
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Descriptions */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800 flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon icon="mdi:text-box-multiple" className="w-5 h-5 text-primary" />
                  Project Descriptions <span className="text-red-400">*</span>
                </CardTitle>
                <Button size="sm" onClick={handleAddDescription} className="bg-primary hover:bg-primary/90 text-white">
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
                          descriptionCount={formData.descriptions.length}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {formData.descriptions.length === 0 && (
                  <div className="text-center py-12 bg-neutral-800 rounded-lg border border-neutral-700 mt-4">
                    <Icon icon="mdi:text-box-outline" className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400 text-sm">No descriptions added yet</p>
                    <p className="text-neutral-500 text-xs mt-1">Click "Add Paragraph" to create content</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Header Image */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon icon="mdi:image" className="w-5 h-5 text-primary" />
                  Header Image (3:2 Ratio) <span className="text-red-400">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {formData.header_image_url ? (
                  <div className="relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 aspect-[3/2] max-w-3xl mx-auto">
                    <img src={formData.header_image_url} alt={formData.title || "Header preview"} className="w-full h-full object-contain" />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button onClick={() => headerImageInputRef.current?.click()} className="bg-primary hover:bg-primary/90">
                        <Icon icon="mdi:image-edit" className="w-5 h-5 mr-2" />
                        Change Image
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleInputChange("header_image_url", "");
                          if (headerImageInputRef.current) headerImageInputRef.current.value = "";
                        }}
                      >
                        <Icon icon={ICON_ASSETS.DELETE} className="w-5 h-5 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => headerImageInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-neutral-800/50 transition-all aspect-[3/2] max-w-3xl mx-auto flex flex-col items-center justify-center"
                  >
                    <Icon icon="mdi:cloud-upload" className="w-16 h-16 text-neutral-600 mb-4" />
                    <p className="text-neutral-400 text-sm mb-2">Click to upload header image</p>
                    <p className="text-neutral-500 text-xs">Image will be cropped to 3:2 ratio</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Screenshots */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800 flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon icon="mdi:image-multiple" className="w-5 h-5 text-primary" />
                  Project Screenshots (drag horizontally) <span className="text-red-400">*</span>
                </CardTitle>
                <Button size="sm" onClick={handleAddScreenshot} className="bg-primary hover:bg-primary/90 text-white">
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-1" />
                  Add Screenshot
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleImageDragEnd}
                  modifiers={[restrictToParentElement, restrictToHorizontalAxis, restrictToWindowEdges]}
                >
                  <SortableContext items={formData.images.map((_, i) => `img-${i}`)}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
                      {formData.images.map((image, index) => (
                        <SortableImageItem key={`img-${index}`} id={`img-${index}`} image={image} index={index} onDelete={handleDeleteImage} onPreview={(url) => setPreviewImage(url)} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {formData.images.length === 0 && (
                  <div className="text-center py-12 bg-neutral-800 rounded-lg border border-neutral-700 mt-4">
                    <Icon icon="mdi:image-off" className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400 text-sm">No project screenshots added yet</p>
                    <p className="text-neutral-500 text-xs mt-1">Click "Add Screenshot" to upload images</p>
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
