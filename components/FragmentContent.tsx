import { Card } from "@/components/ui/card";
import Image from "next/image";
import type { FragmentsResponse } from "@/utils/types";

export const FragmentContent = ({ data }: { data?: FragmentsResponse }) => {
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
        <FragmentCard key={fragment.id} fragment={fragment} />
      ))}
    </div>
  );
};

const FragmentCard = ({ fragment }: { fragment: FragmentsResponse["fragments"][number] }) => {
  const renderContent = () => {
    try {
      switch (fragment.type) {
        case "text/plain":
        case "text/markdown":
        case "text/html":
          return <p className="text-gray-300 break-words">{fragment.content}</p>;

        case "application/json":
          const parsedJson = JSON.parse(fragment.content);
          return (
            <pre className="text-gray-300 text-sm overflow-auto">
              {JSON.stringify(parsedJson, null, 2)}
            </pre>
          );

        case "image/png":
        case "image/jpeg":
        case "image/webp":
          return (
            <div className="relative aspect-video">
              <Image
                src={fragment.content}
                alt="Fragment content"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          );

        default:
          return <p className="text-gray-400">Unsupported fragment type</p>;
      }
    } catch (err: unknown) {
      console.log(err);
      return <p className="text-red-500">Error rendering content</p>;
    }
  };

  return (
    <Card className="p-4 bg-black/40 border-orange-900/50 hover:border-orange-500/50 transition-colors">
      <div className="mb-2">
        <span className="text-sm text-orange-500 font-mono">{fragment.type}</span>
        <time className="block text-xs text-gray-400 mt-1">
          Created: {new Date(fragment.created).toLocaleDateString()}
        </time>
        {fragment.updated && (
          <time className="block text-xs text-gray-400">
            Updated: {new Date(fragment.updated).toLocaleDateString()}
          </time>
        )}
      </div>
      <div className="max-h-64 overflow-hidden rounded-lg">{renderContent()}</div>
    </Card>
  );
};
