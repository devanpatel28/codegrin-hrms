import React from "react";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ImagePreviewDialog({ open, onClose, imageUrl }) {
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
                 
          w-[90vw]              
          sm:w-[90vw]
          bg-neutral-900 
          border-neutral-800 
          p-0
        "
      >
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full max-h-[100vh] object-contain rounded"
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-2 rounded-full"
          >
            <Icon icon="mdi:close" className="text-white w-6 h-6" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
