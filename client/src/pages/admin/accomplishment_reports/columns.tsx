import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import AccomplishmentReportActions from "./accomplishmentReportActions"

export type ArUsers = {
    name: string,
    email: string,

} 
export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className='w-4 h-4 ml-2' />
                </Button>
            )
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const log = row.original

            return <AccomplishmentReportActions userId={log.id} />
        },
    },
]