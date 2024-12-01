"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

export type Patient = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  birth_date: string
  medical_record_number: string
  insurance_status: "active" | "expired" | "pending"
  status: "active" | "inactive" | "archived"
  gender: string
  email?: string
  phone?: string
}

export const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Vybrat vše"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Vybrat řádek"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "medical_record_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Číslo záznamu" />
    ),
    cell: ({ row }) => <div>{row.getValue("medical_record_number")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jméno a příjmení" />
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name
      const lastName = row.original.last_name
      return (
        <div className="flex flex-col">
          <span className="font-medium">{`${firstName} ${lastName}`}</span>
          {row.original.email && (
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          )}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "birth_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Datum narození" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("birth_date"))
      return <div>{format(date, "d. MMMM yyyy", { locale: cs })}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "active"
              ? "success"
              : status === "inactive"
              ? "warning"
              : "secondary"
          }
        >
          {status === "active"
            ? "Aktivní"
            : status === "inactive"
            ? "Neaktivní"
            : "Archivován"}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "insurance_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pojištění" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("insurance_status") as string
      return (
        <Badge
          variant={
            status === "active"
              ? "success"
              : status === "expired"
              ? "destructive"
              : "secondary"
          }
        >
          {status === "active"
            ? "Aktivní"
            : status === "expired"
            ? "Vypršelo"
            : "Čeká na schválení"}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
