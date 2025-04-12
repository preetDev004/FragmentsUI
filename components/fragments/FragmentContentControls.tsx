import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALID_FRAGMENT_CONVERSIONS } from "@/constants";
import { Edit2, Save, X } from "lucide-react";
import { Fragment, FragmentType } from "@/utils/types";

interface ContentControlsProps {
  fragment: Fragment;
  isEditing: boolean;

  // eslint-disable-next-line no-unused-vars
  setIsEditing: (value: boolean) => void;
  isLoading: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  viewFormat: string;

  // eslint-disable-next-line no-unused-vars
  setViewFormat: (format: string) => void;

  // eslint-disable-next-line no-unused-vars
  setIsFormatChanging: (value: boolean) => void;
  isPending: boolean;
  hasError: boolean;

  // eslint-disable-next-line no-unused-vars
  isEditableType: (type: FragmentType) => boolean;
}

export const FragmentContentControls = ({
  fragment,
  isEditing,
  setIsEditing,
  isLoading,
  handleSave,
  handleCancel,
  viewFormat,
  setViewFormat,
  setIsFormatChanging,
  isPending,
  hasError,
  isEditableType,
}: ContentControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-orange-300 text-sm uppercase tracking-wider font-semibold">Content</h3>
      <div className="flex items-center gap-2">
        {isEditableType(fragment.type) &&
          !isLoading &&
          !hasError &&
          !isEditing &&
          viewFormat === "original" && (
            <Button
              onClick={() => setIsEditing(true)}
              className="h-8 px-2 bg-orange-700/30 hover:bg-orange-600/50 text-orange-300 border-none"
              title="Edit content"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}

        {isEditing && (
          <>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="h-8 px-2 bg-green-700/30 hover:bg-green-600/50 text-green-300 border-none"
              title="Save changes"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleCancel}
              className="h-8 px-2 bg-red-700/30 hover:bg-red-600/50 text-red-300 border-none"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}

        {VALID_FRAGMENT_CONVERSIONS[fragment.type as keyof typeof VALID_FRAGMENT_CONVERSIONS]
          ?.length > 0 &&
          !isEditing && (
            <Select
              value={viewFormat}
              onValueChange={(value: string) => {
                if (value !== viewFormat) {
                  setIsFormatChanging(true);
                  setViewFormat(value);
                }
              }}
            >
              <SelectTrigger className="w-32 bg-orange-950/30 border-orange-900/30 text-orange-300">
                <SelectValue placeholder="View as..." />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-orange-900/50">
                <SelectItem value="original" className="text-orange-300">
                  Original
                </SelectItem>
                {VALID_FRAGMENT_CONVERSIONS[
                  fragment.type as keyof typeof VALID_FRAGMENT_CONVERSIONS
                ]?.map((format) => (
                  <SelectItem key={format} value={format} className="text-orange-300">
                    {format.split("/")[1].toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
      </div>
    </div>
  );
};
