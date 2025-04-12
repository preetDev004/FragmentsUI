import { AlertCircle } from "lucide-react";
import { Fragment } from "@/utils/types";
import { useEffect, useRef } from "react";

interface ContentEditorProps {
  fragment: Fragment;
  editedContent: string;
  // eslint-disable-next-line no-unused-vars
  setEditedContent: (content: string) => void;
  validationError: string | null;
  // eslint-disable-next-line no-unused-vars
  setValidationError: (error: string | null) => void;
  isPending: boolean;
}

export const FragmentContentEditor = ({
  fragment,
  editedContent,
  setEditedContent,
  validationError,
  setValidationError,
  isPending,
}: ContentEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full" style={{ position: "relative", zIndex: 50 }}>
      {validationError && (
        <div className="mb-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-sm">
          <AlertCircle size={16} className="inline-block mr-1" />
          {validationError}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={editedContent}
        onChange={(e) => {
          setEditedContent(e.target.value);
          if (validationError) setValidationError(null);
        }}
        className="w-full h-full bg-black/60 border border-orange-500/30 rounded text-orange-100/90 p-2 font-mono text-sm outline-none focus:border-orange-500/50 min-h-[200px]"
        placeholder={`Enter your ${fragment.type} content here...`}
        disabled={isPending}
        style={{ position: "relative", zIndex: 50 }}
      />
    </div>
  );
};
