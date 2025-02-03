"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALID_FRAGMENT_TYPES } from "@/constants";
import { covertAuthToUser } from "@/utils/user";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { addUserFragment, getUserFragments } from "../api";
// import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileWithPreview, FragmentType } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertCircle,
  FileText,
  Image as Img,
  Plus,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { queryClient } from "@/components/QueryProvider";

const DashboardPage = () => {
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false)

  const fetchUserFragments = async () => {
    if (auth.isAuthenticated && auth.user) {
      const userFragments = await getUserFragments(
        covertAuthToUser(auth.user, "application/json")
      );
      console.log(userFragments);
      return userFragments || null

    }
    
  };

  const { data: fragments } = useQuery({
    queryKey: ["getFgms"],
    queryFn: fetchUserFragments,
  });
  console.log(fragments)

  useEffect(() => {
    // Clean up URL parameters after successful authentication
    if (auth.isAuthenticated && window.location.search) {
      // Remove query parameters while preserving the path
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    
  }, [auth]);
  return (
    <ProtectedRoute>
      <div className="h-auto max-h-screen">
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-between items-center mb-8 transition-all duration-200">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
                  Dashboard
                </h1>

                <Dialog open={isOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={()=>setIsOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Fragment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/95 border-orange-900/50 text-white flex flex-col items-start justify-center">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
                        Fragment Details
                      </DialogTitle>
                    </DialogHeader>
                    <CreateFragmentForm setIsOpen={setIsOpen} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Dashboard Content */}
              <Card className="p-6 bg-black/40 border-orange-900/50">
                
                  <p className="text-gray-400">
                    Your fragments will appear here.
                  </p>
               
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};
export default DashboardPage;

function CreateFragmentForm({setIsOpen} : {setIsOpen : Dispatch<SetStateAction<boolean>>}) {
  const { toast } = useToast();
  const auth = useAuth();

  const [selectedType, setSelectedType] = useState<FragmentType>("text/plain");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<FileWithPreview | null>(null);

  const mutation = useMutation({
    mutationFn: addUserFragment,
    mutationKey: ["addFgm"],
    onSuccess: () => {
      toast({
        title: "Fragment Created Successfully!",
        description: `It's a ${selectedType} fragment.`,
        variant: "success",
      });
      setContent("");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getFgms'] })
      setIsOpen(false)
    },
    onError: (err: Error) => {
      toast({
        title: "Error Creating Fragment",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const validateContent = (type: FragmentType, content: string) => {
    if (!content.trim() && !file) {
      return "Content cannot be empty";
    }

    if (type === "application/json" && !file) {
      try {
        JSON.parse(content);
      } catch {
        return "Invalid JSON format";
      }
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateContent(selectedType, content);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    mutation.mutate({
      type: selectedType,
      content,
      file,
      user: covertAuthToUser(auth.user!, selectedType),
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === selectedType) {
        handleFileSelection(droppedFile);
      } else {
        setError(`Please drop a valid ${selectedType} file`);
        e.dataTransfer.clearData();
      }
    },
    [selectedType]
  );

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.type !== selectedType) {
      setError(`Invalid file type. Expected ${selectedType}`);
      return;
    }
    const fileWithPreview = selectedFile as FileWithPreview;
    if (selectedFile.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(selectedFile);
    }

    setFile(fileWithPreview);
    setError("");
  };

  const isTextType =
    selectedType.startsWith("text/") || selectedType === "application/json";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Fragment Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Fragment Type</label>
        <Select
          value={selectedType}
          onValueChange={(value: FragmentType) => {
            setSelectedType(value);
            setFile(null);
            setContent("");
          }}
        >
          <SelectTrigger className="w-full bg-black/40 border-orange-900/50 text-white">
            <SelectValue placeholder="Select a fragment type" />
          </SelectTrigger>
          <SelectContent className="bg-black border-orange-900/50">
            <div className="p-2 transition-all duration-300">
              <div className="text-orange-500 flex items-center gap-2 mb-2">
                <FileText size={16} /> Text Formats
              </div>
              {VALID_FRAGMENT_TYPES.filter(
                (type) =>
                  type.startsWith("text/") || type === "application/json"
              ).map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className={`${
                    type === selectedType
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-300"
                  } hover:text-orange-500 hover:bg-orange-950/30 cursor-pointer`}
                >
                  {type}
                </SelectItem>
              ))}
              <div className="text-orange-500 flex items-center gap-2 mb-2 mt-4">
                <Img size={16} /> Image Formats
              </div>
              {VALID_FRAGMENT_TYPES.filter((type) =>
                type.startsWith("image/")
              ).map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className={`${
                    type === selectedType
                      ? "text-orange-500 underline underline-offset-4"
                      : "text-gray-300"
                  } hover:text-orange-500 hover:bg-orange-950/30 cursor-pointer`}
                >
                  {type}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Content Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Content</label>
        {isTextType ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-orange-900/50 rounded-md text-gray-300 focus:outline-none focus:border-orange-500 min-h-[200px] resize-none"
            placeholder={`Enter your ${selectedType} content here...`}
          />
        ) : (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 transition-colors",
              isDragging
                ? "border-orange-500 bg-orange-950/20"
                : "border-orange-900/50 hover:border-orange-500/50"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
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
                  className="w-full border-orange-900/50 text-orange-500 hover:bg-orange-950/30"
                  onClick={() => {
                    if (file.preview) {
                      URL.revokeObjectURL(file.preview);
                    }
                    setFile(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Remove File
                </Button>
              </div>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer space-y-4"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="sr-only"
                  accept={selectedType}
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      if (selectedFile.type === selectedType) {
                        handleFileSelection(selectedFile);
                      } else {
                        setError(`Please select a valid ${selectedType} file`);
                        e.target.value = "";
                      }
                    }
                  }}
                />
                <Upload className="h-12 w-12 text-gray-400" />
                <div className="flex items-center text-sm leading-6 text-gray-400">
                  <span className="font-semibold text-orange-500 hover:text-orange-400 transition-colors">
                    Click to upload
                  </span>
                  <span className="ml-2">or drag and drop</span>
                </div>
                <p className="text-xs leading-5 text-gray-400">
                  Only <span className="font-semibold">{selectedType}</span>{" "}
                  files are accepted
                </p>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {/* {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2 bg-orange-950/30" />
          <p className="text-sm text-gray-400 text-center">{uploadProgress}% uploaded</p>
        </div>
      )} */}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
        // disabled={uploadProgress > 0 && uploadProgress < 100}
      >
        Create Fragment
      </Button>
    </form>
  );
}
