"use client";

import { XIcon } from "lucide-react";
import AmplifyWrapper from "./AmplifyWrapper";

export function LoginModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <AmplifyWrapper>{null}</AmplifyWrapper>
      <XIcon
        onClick={onClose}
        className="w-5 h-5 sm:w-8 sm:h-8 text-white hover:text-white/60 absolute top-5 right-5 z-10 cursor-pointer"
      />
    </div>
  );
}
