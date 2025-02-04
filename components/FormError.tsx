// src/components/fragments/FormError.tsx
import { AlertCircle } from "lucide-react";

export const FormError = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-red-500">
    <AlertCircle size={20} />
    <span>{message}</span>
  </div>
);