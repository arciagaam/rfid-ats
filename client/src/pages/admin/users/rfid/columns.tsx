import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type RfidColumn = {
    id: string,
    number: string,
    status: string,
}

export interface IRfidRow extends RfidColumn {
    _id: string,
    number: string,
    status: string,
}

export const columns: ColumnDef<RfidColumn>[] = [
    {
        accessorKey: 'number',
        header: 'Number',
    },

    {
        accessorKey: 'status',
        cell: ({ row }) => {
            const status: string = row.getValue('status')
            return (
                <Badge
                    className={`${
                        status == 'active'
                            ? 'border-green-500 text-green-500'
                            : 'border-red-500 text-red-500'
                    } bg-transparent font-thin hover:bg-transparent`}>
                    {status}
                </Badge>
            )
        },

        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Status
                    <ArrowUpDown className='w-4 h-4 ml-2' />
                </Button>
            )
        },
    },

    {
        accessorKey: 'actions',
        header: 'Actions',
    },
]
