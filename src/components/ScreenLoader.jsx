import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function ScreenLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <Spinner size="large" />
      <p className="text-neutral-200 text-lg mt-4">{text}</p>
    </div>
  );
}
