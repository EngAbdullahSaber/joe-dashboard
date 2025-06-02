"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import ViewMore from "./ViewMore";
import DeleteButton from "./DeleteButton";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";

interface Task {
  id: string;
  Role?: string;
  Mac?: string;
  Name?: string;
  CREATED?: string;
  Email?: string;
  ACTIVATION?: string;
  VACATION?: string;
  GENDER?: string;
  BIRTH?: string;
  ADDRESS?: string;
  PHONE?: string;
}
const TableData = ({ t }: { t: any }) => {
  const columns: ColumnDef<Task>[] = [
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
          className="t-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="t-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="secondary"
          >
            <Icon icon="heroicons:pencil" className="h-4 w-4" />
          </Button>
          <ViewMore />

          <DeleteButton />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"id"} />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.original.id}</div>,
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "User Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"User Name"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Role"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            {/* <span className="max-w-[500px] truncate font-medium">
              {row.original.Role}
            </span> */}
            <Badge
              className="!text-center"
              color={
                (row.original.Role === "Super Admin" && "destructive") ||
                (row.original.Role === "Admin" && "info") ||
                (row.original.Role === "User" && "warning") ||
                "default"
              }
            >
              {row.original.Role}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Mac Id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Mac Id"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Mac}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Email"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Email}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Phone"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.PHONE}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Address"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.ADDRESS}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Birth Date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Birth Date"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.BIRTH}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Gender"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            {/* <span className="max-w-[500px] truncate font-medium">
              {row.original.GENDER}
            </span> */}
            <Badge
              className="!text-center"
              color={
                (row.original.GENDER === "Male" && "success") ||
                (row.original.GENDER === "Female" && "warning") ||
                "default"
              }
            >
              {row.original.GENDER}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Activation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Activation"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Badge
              className="!text-center"
              color={
                (row.original.ACTIVATION === "Active" && "success") ||
                (row.original.ACTIVATION === "Not Active" && "destructive") ||
                "default"
              }
            >
              {row.original.ACTIVATION}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Vacation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Vacation"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Badge
              className="!text-center"
              color={
                (row.original.VACATION === "Working" && "success") ||
                (row.original.VACATION === "In Vacation" && "destructive") ||
                "default"
              }
            >
              {row.original.VACATION}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Created",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Created"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.CREATED}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];

  return (
    <div>
      {/* Render your data table here using the fetched tasks */}
      {/* Assuming you have a table component that takes columns and data */}
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default TableData;
