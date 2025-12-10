import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ImageCropDialog({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 3 / 2,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleCropArea = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const confirmCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setProcessing(true);

    try {
      const image = new Image();
      image.src = imageSrc;
      await image.decode();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        onCropComplete(url, blob);
        onClose();
      }, "image/jpeg", 0.95);
    } catch (error) {
      toast.error("Failed to crop image");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Crop Image (3:2)</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Adjust crop area then apply changes.
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-neutral-950 rounded-lg overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropArea}
            />
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Label className="text-neutral-300 text-sm">Zoom</Label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmCrop}
            disabled={processing}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {processing ? "Processing..." : "Crop & Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
