"use client";

import { FragmentDetailsDialog } from "@/components/FragmentDetails";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authUtils } from "@/utils/auth";
import { Fragment } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownUp,
  ArrowUpDown,
  Map,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Badge } from "@/components/ui/badge";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Fragment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
      className="ml-4"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
      className="ml-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <p className="font-semibold text-gray-300 my-2.5">Fragment ID</p>
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <>
          <span className="md:hidden">
            {id.length > 30 ? `${id.substring(0, 20)}...` : id}
          </span>
          <span className="hidden md:block">{id}</span>
        </>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => (
      <p className="font-semibold text-gray-300 hidden sm:block my-2.5">Type</p>
    ),
    cell: ({ row }) => {
      return <p className="hidden sm:block">{row.getValue("type")}</p>;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold text-gray-300 hover:bg-transparent hover:text-white hidden md:flex my-2.5"
      >
        CreatedAt
        {column.getIsSorted() === "asc" ? (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownUp className="ml-2 h-4 w-4 opacity-50" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("created") as string;

      const createdDate = dateString ? new Date(dateString) : null;
      const timeAgo = createdDate
        ? formatDistanceToNow(createdDate, { addSuffix: true })
        : null;
      return <p className="hidden md:block">{timeAgo}</p>;
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    header: ({ table }) => {
      const selectedCount = table.getSelectedRowModel().rows.length;

      if (selectedCount === 0) {
        return <div className="w-8 p-2" />;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0 bg-transparent text-gray-300 relative my-2.5">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-4 w-4 p-2 flex items-center justify-center bg-orange-600 text-xs hover:bg-orange-600">
                {selectedCount}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 p-2 bg-zinc-900 shadow-md border-none text-gray-300"
          >
            <DropdownMenuItem
              onClick={() => {
                // Handle bulk delete here
                const selectedIds = table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original.id);
                console.log("Delete selected:", selectedIds);
              }}
              className="cursor-pointer text-red-500 hover:bg-red-700/20 flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete ({selectedCount}) Selected</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    cell: ({ row }) => {
      const fragment = row.original;
      return <FragmentActionsMenu fragment={fragment} />;
    },
  },
];

const FragmentActionsMenu = ({ fragment }: { fragment: Fragment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const auth = useAuth();

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0 bg-transparent text-gray-300">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 p-2 bg-zinc-900 shadow-md border-none text-gray-300 space-y-1"
        >
          <DropdownMenuItem
            onClick={() => {
              setIsDetailsOpen(true);
              setIsOpen(false);
            }}
            className="cursor-pointer hover:bg-orange-900/20 hover:text-orange-400"
          >
            <Map /> Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", fragment.id)}
            className="cursor-pointer text-red-500 hover:bg-red-700/20"
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDetailsOpen && (
        <FragmentDetailsDialog
          isOpen={isDetailsOpen}
          fragment={fragment}
          onOpenChange={setIsDetailsOpen}
          user={authUtils.getUser(auth.user!)}
        />
      )}
    </>
  );
};
