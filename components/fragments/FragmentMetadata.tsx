import { Clock, Info, Tag } from "lucide-react";
import { Fragment } from "@/utils/types";

interface MetadataProps {
  fragment: Fragment;
  formattedDate: string | null;
}

export const FragmentMetadata = ({ fragment, formattedDate }: MetadataProps) => {
  return (
    <div className="mt-4 mb-4 bg-orange-950/10 border border-orange-900/20 rounded-lg overflow-hidden backdrop-blur-sm w-full">
      <div className="grid grid-cols-2 gap-2">
        {/* ID - First Row, Full Width */}
        <div className="col-span-2">
          <div className="flex items-center space-x-3 p-2 rounded-md bg-orange-950/30">
            <Info size={18} className="text-orange-400" />
            <div className="flex flex-col">
              <span className="text-orange-300 text-xs uppercase tracking-wider font-semibold">
                ID
              </span>
              <div className="text-white/90 text-xs font-mono mt-1 overflow-hidden text-ellipsis w-full">
                {fragment.id}
              </div>
            </div>
          </div>
        </div>

        {/* Created - Second Row, Right Column */}
        <div className="col-span-1">
          <div className="flex items-center space-x-3 p-2 rounded-md bg-orange-950/30">
            <Clock size={18} className="text-orange-400" />
            <div className="flex flex-col">
              <span className="text-orange-300 text-xs uppercase tracking-wider font-semibold">
                Created
              </span>
              <div className="text-white/90 text-sm mt-1">{formattedDate || "Unknown"}</div>
            </div>
          </div>
        </div>

        {/* Type - Second Row, Left Column */}
        <div className="col-span-1">
          <div className="flex items-center space-x-3 p-2 rounded-md bg-orange-950/30">
            <Tag size={18} className="text-orange-400" />
            <div className="flex flex-col">
              <span className="text-orange-300 text-xs uppercase tracking-wider font-semibold">
                Type
              </span>
              <div className="text-white/90 text-sm mt-1 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                {fragment.type || "text/plain"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
