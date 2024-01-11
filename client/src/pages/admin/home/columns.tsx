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
    AmTimeIn: string
    AmTimeOut: string
    PmTimeIn: string
    PmTimeOut: string
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
        accessorKey: 'AmTimeIn',
        header: 'AM IN',
    },
    {
        accessorKey: 'AmTimeOut',
        header: 'AM OUT',
    },
    {
        accessorKey: 'PmTimeIn',
        header: 'PM IN',
    },
    {
        accessorKey: 'PmTimeOut',
        header: 'PM OUT',
    },
    {
        accessorKey: 'totalTimeRendered',
        header: 'Total Time Rendered',
    },
]
