import React, { useEffect, useState, useRef } from "react";
import Cropper from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function ImageCropDialog({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 3 / 2,
}) {
  const containerRef = useRef(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropSize, setCropSize] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /* ----------------------------------------
     Set PERFECT crop frame (grid) size
  -----------------------------------------*/
  useEffect(() => {
    if (!isOpen) return;

    setCrop({ x: 0, y: 0 });
    setZoom(1);

    setTimeout(() => {
      if (!containerRef.current) return;

      const W = containerRef.current.offsetWidth;
      const H = W / aspectRatio;

      setCropSize({
        width: W,
        height: H,
      });
    }, 20);
  }, [isOpen]);

  /* ----------------------------------------
     Prevent moving image when zoom = 1
  -----------------------------------------*/
  const handleCropChange = (newCrop) => {
    if (zoom === 1) {
      setCrop({ x: 0, y: 0 });
    } else {
      setCrop(newCrop);
    }
  };

  /* ----------------------------------------
     Final Crop
  -----------------------------------------*/
  const confirmCrop = async () => {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
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
      const url = URL.createObjectURL(blob);
      onCropComplete(url, blob);
      onClose();
    }, "image/png");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-neutral-900 border border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-white">Crop Image (3:2)</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Only the visible crop area will be saved.
          </DialogDescription>
        </DialogHeader>

        {/* === PERFECT CROP FRAME === */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden"
          style={{ height: "auto", aspectRatio: "3 / 2" }}
        >
          {cropSize && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              cropSize={cropSize}     // ⭐ FIXES GRID EXACTLY
              objectFit="cover"
              
              restrictPosition={true}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
              onCropComplete={(_, area) => setCroppedAreaPixels(area)}
              minZoom={1}
              maxZoom={3}
            />
          )}
        </div>

        {/* ZOOM CONTROL */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-neutral-300 text-sm">Zoom</span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={confirmCrop}>Crop & Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
