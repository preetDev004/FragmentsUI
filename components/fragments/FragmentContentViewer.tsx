import { Fragment } from "@/utils/types";
import { Download } from "lucide-react";
import Image from "next/image";

interface ContentViewerProps {
  fragment: Fragment;
  fragmentData: string | null;
  isLoading: boolean;
  viewFormat: string;
  handleImageDownload: () => void;
}

export const FragmentContentViewer = ({
  fragment,
  fragmentData,
  isLoading,
  viewFormat,
  handleImageDownload,
}: ContentViewerProps) => {
  if (fragment.type.startsWith("image/")) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center py-4 bg-black/40 border border-orange-900/30 rounded-md">
        <div className="relative max-h-80 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-pulse flex space-x-2 justify-center">
                <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-150"></div>
              </div>
              <div className="text-orange-400/80 text-sm mt-4">Converting image...</div>
            </div>
          ) : fragmentData ? (
            <Image
              src={fragmentData}
              width={500}
              height={500}
              alt={`Fragment ${fragment.id}`}
              className="max-w-full max-h-80 object-contain rounded p-4"
            />
          ) : (
            <div className="text-orange-400/80 text-sm">No image data available</div>
          )}
        </div>

        {/* Download Button */}
        {fragmentData && !isLoading && (
          <button
            onClick={handleImageDownload}
            className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md flex items-center justify-center transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download{" "}
            {viewFormat === "original"
              ? fragment.type.split("/")[1].toUpperCase()
              : viewFormat.split("/")[1].toUpperCase()}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-black border border-orange-900/30 p-4 rounded-md max-h-80 overflow-auto font-mono text-sm whitespace-pre-wrap text-orange-100/90 relative">
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      {fragmentData || "No content available"}
    </div>
  );
};
