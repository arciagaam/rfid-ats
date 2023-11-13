import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Badge } from "lucide-react"
import ScheduleActions from "./scheduleactions"

export type Schedule = {
    id: string,
    name: string,
}

export const columns: ColumnDef<Schedule>[] = [
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
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;
            return <ScheduleActions userId={user.id} />
        },
    },
]