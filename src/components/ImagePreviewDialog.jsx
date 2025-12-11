import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function ImagePreviewDialog({ open, onClose, imageUrl }) {
  if (!open || !imageUrl) return null;

  return (
    <div
      className="
        fixed top-0 left-0 right-0 -bottom-10 z-[9999]
        bg-black/10 backdrop-blur-xs
        flex items-center justify-center
        p-4
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="relative bg-neutral-500 rounded-lg max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          onClick={onClose}
          className="
            absolute -top-4 -right-4
            bg-neutral-900 border border-neutral-700
            hover:bg-neutral-800
            rounded-full p-2 shadow-lg
            z-50
          "
          size="icon"
        >
          <Icon icon="mdi:close" className="w-6 h-6 text-white" />
        </Button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Preview"
          className="
            w-full h-full
            max-w-[90vw] max-h-[90vh]
            object-contain rounded-lg
            shadow-xl
          "
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
