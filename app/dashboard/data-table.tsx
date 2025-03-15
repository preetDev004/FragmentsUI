"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { DataTablePagination } from "@/components/ui/DataTablePagination";
import { CreateFragmentDialog } from "@/components/CreateFragmentDailog";
import { useAuth } from "react-oidc-context";
import { authUtils } from "@/utils/auth";
import { FragmentDetailsDialog } from "@/components/FragmentDetails";
import { Fragment } from "@/utils/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Fragment, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const auth = useAuth();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Add this
    getSortedRowModel: getSortedRowModel(), // Add this
    onSortingChange: setSorting, // Add this
    initialState: {
      pagination: {
        pageSize: 10, // Set default page size
        pageIndex: 0, // Start at first page
      },
    },
    state: {
      sorting, // Add this
    },
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <CreateFragmentDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          user={authUtils.getUser(auth.user!)}
        />
      </div>

      <div className="rounded-md border bg-black/40 border-orange-900/50 mt-5 text-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-gray-300" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => {
                    setSelectedFragment(row.original);
                    setIsModalOpen(true);
                  }}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {selectedFragment && (
        <FragmentDetailsDialog
          isOpen={isModalOpen}
          fragment={selectedFragment}
          onOpenChange={setIsModalOpen}
          user={authUtils.getUser(auth.user!)}
        />
      )}
    </>
  );
}