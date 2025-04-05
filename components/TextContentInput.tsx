// src/components/fragments/TextContentInput.tsx
import { FragmentType } from "@/utils/types";

export const TextContentInput = ({
  value,
  onChange,
  selectedType,
}: {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  selectedType: FragmentType;
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 bg-black/40 border border-orange-900/50 rounded-md text-gray-300 focus:outline-none focus:border-orange-500 min-h-[200px] resize-none"
    placeholder={`Enter your ${selectedType} content here...`}
  />
);
