import { Card } from "@/components/ui/card";
import type { FragmentsIDsResponse } from "@/utils/types";

export const FragmentIDS = ({ data }: { data?: FragmentsIDsResponse }) => {
  if (!data || data.status !== "ok" || !data.fragments?.length) {
    return (
      <Card className="p-6 bg-black/40 border-orange-900/50">
        <p className="text-gray-400">Your fragments will appear here.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.fragments.map((fragment) => (
        <Card
          key={fragment}
          className="p-4 bg-black/40 border-orange-900/50 hover:border-orange-500/50 transition-colors"
        >
          <div className="mb-2">
            <p className="text-gray-300">{fragment.slice(0, 30)}...</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
