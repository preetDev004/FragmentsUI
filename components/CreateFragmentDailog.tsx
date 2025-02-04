import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateFragmentForm } from "@/components/CreateFragmentForm";
import type { User } from "@/utils/types";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const CreateFragmentDialog = ({
  isOpen,
  onOpenChange,
  user,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => onOpenChange(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Fragment
      </Button>
    </DialogTrigger>
    <DialogContent className="bg-black/95 border-orange-900/50 text-white flex flex-col items-start justify-center">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
          Fragment Details
        </DialogTitle>
      </DialogHeader>
      <CreateFragmentForm onOpenChange={onOpenChange} user={user} />
    </DialogContent>
  </Dialog>
);