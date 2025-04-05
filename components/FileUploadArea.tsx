// src/components/fragments/FileUploadArea.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FileWithPreview, FragmentType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";

export const FileUploadArea = ({
  selectedType,
  file,
  isDragging,
  handleDrag,
  handleFileSelection,
  clearFile,
}: {
  selectedType: FragmentType;
  file: FileWithPreview | null;
  isDragging: boolean;
  // eslint-disable-next-line no-unused-vars
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  // eslint-disable-next-line no-unused-vars
  handleFileSelection: (file: File) => void;
  clearFile: () => void;
}) => (
  <div
    className={cn(
      "relative border-2 border-dashed rounded-lg p-8 transition-colors",
      isDragging
        ? "border-orange-500 bg-orange-950/20"
        : "border-orange-900/50 hover:border-orange-500/50"
    )}
    onDragOver={handleDrag}
    onDragLeave={handleDrag}
    onDrop={(e) => {
      handleDrag(e);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelection(droppedFile);
    }}
  >
    {file ? (
      <div className="space-y-4">
        {file.preview ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={file.preview}
              alt="Preview"
              className="object-contain w-full h-full"
              width={800}
              height={600}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-300">
            <FileText size={20} />
            <span>{file.name}</span>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full border-orange-900/50 bg-orange-950/30 hover:bg-orange-950 text-orange-500 hover:text-orange-500"
          onClick={clearFile}
        >
          <X className="mr-2 h-4 w-4" /> Remove File
        </Button>
      </div>
    ) : (
      <FileUploadInput selectedType={selectedType} onFileSelect={handleFileSelection} />
    )}
  </div>
);

const FileUploadInput = ({
  selectedType,
  onFileSelect,
}: {
  selectedType: FragmentType;
  // eslint-disable-next-line no-unused-vars
  onFileSelect: (file: File) => void;
}) => (
  <label
    htmlFor="file-upload"
    className="flex flex-col items-center justify-center cursor-pointer space-y-4"
  >
    <input
      type="file"
      id="file-upload"
      className="sr-only"
      accept={selectedType}
      onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
    />
    <Upload className="h-12 w-12 text-gray-400" />
    <div className="flex items-center text-sm leading-6 text-gray-400">
      <span className="font-semibold text-orange-500 hover:text-orange-400 transition-colors">
        Click to upload
      </span>
      <span className="ml-2">or drag and drop</span>
    </div>
    <p className="text-xs leading-5 text-gray-400">
      Only <span className="font-semibold">{selectedType}</span> files are accepted
    </p>
  </label>
);
