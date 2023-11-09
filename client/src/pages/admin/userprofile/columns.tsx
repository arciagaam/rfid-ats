import { ColumnDef } from '@tanstack/react-table'

export type Log = {
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
