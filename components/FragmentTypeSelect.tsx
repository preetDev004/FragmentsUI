// src/components/fragments/FragmentTypeSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALID_FRAGMENT_GROUPS } from "@/constants";
import { FileText, Image as Img } from "lucide-react";
import type { FragmentType } from "@/utils/types";

export const FragmentTypeSelect = ({
  selectedType,
  onTypeChange,
}: {
  selectedType: FragmentType;
  // eslint-disable-next-line no-unused-vars
  onTypeChange: (type: FragmentType) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white">Fragment Type</label>
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-full bg-black/40 border-orange-900/50 text-white">
        <SelectValue placeholder="Select a fragment type" />
      </SelectTrigger>
      <SelectContent className="bg-black border-orange-900/50">
        <FragmentTypeGroup
          label="Text Formats"
          icon={<FileText size={16} />}
          types={VALID_FRAGMENT_GROUPS.textTypes}
          selectedType={selectedType}
        />
        <FragmentTypeGroup
          label="Image Formats"
          icon={<Img size={16} />}
          types={VALID_FRAGMENT_GROUPS.imageTypes}
          selectedType={selectedType}
        />
      </SelectContent>
    </Select>
  </div>
);

const FragmentTypeGroup = ({
  label,
  icon,
  types,
  selectedType,
}: {
  label: string;
  icon: React.ReactNode;
  types: FragmentType[];
  selectedType: FragmentType;
}) => (
  <div className="p-2 transition-all duration-300">
    <div className="text-orange-400 flex items-center gap-2 mb-2">
      {icon} {label}
    </div>
    {types.map((type) => (
      <SelectItem
        key={type}
        value={type}
        className={`${
          type === selectedType ? "text-orange-300 underline underline-offset-4" : "text-gray-300"
        } hover:text-orange-300 hover:bg-orange-950/30 cursor-pointer`}
      >
        {type}
      </SelectItem>
    ))}
  </div>
);
