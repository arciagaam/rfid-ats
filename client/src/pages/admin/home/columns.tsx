import { ColumnDef } from '@tanstack/react-table'

// import { ArrowUpDown } from 'lucide-react'
// import { Button } from '@/components/ui/button'

export type Log = {
    user: {
        firstName: string
        middleName: string
        lastName: string
    }
    name: string
    date: string
    timeIn: string
    timeOut: string
    totalTimeRendered: string
    updatedAt: Date
}

export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: 'date',
        header: 'Date',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'timeIn',
        header: 'Time in',
    },
    {
        accessorKey: 'timeOut',
        header: 'Time out',
    },
    {
        accessorKey: 'totalTimeRendered',
        header: 'Total Time Rendered',
    },
]
