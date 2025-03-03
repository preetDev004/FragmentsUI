"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownUp,
  ArrowUpDown,
  Copy,
  Map,
  MoreVertical,
  Trash2
} from "lucide-react";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Fragment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
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
    header: () => <p className="font-semibold text-gray-300">Fragment ID</p>,
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
    header: () => <p className="font-semibold text-gray-300 hidden md:block">Type</p>,
    cell: ({ row }) => {
      return <p className="hidden md:block">{row.getValue("type")}</p>;
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold text-gray-300 hover:bg-transparent hover:text-white hidden md:flex"
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
      const date = new Date(dateString);

      // Format the date
      const month = date.toLocaleString("en-US", { month: "short" });
      const day = date.getDate();
      const year = date.getFullYear();

      // Add ordinal suffix to day
      const ordinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const formattedDate = `${month} ${day}${ordinalSuffix(day)}, ${year}`;

      return <p className="hidden md:block">{formattedDate}</p>;
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fragment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0 bg-transparent text-gray-300">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 p-2 bg-zinc-900 shadow-zinc-800 shadow-md border-none text-gray-300 space-y-1"
          >
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(fragment.id)}
              className="cursor-pointer hover:bg-orange-900/20 hover:text-orange-400"
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit", fragment.id)}
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
      );
    },
  },
];
