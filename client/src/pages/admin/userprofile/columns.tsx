import { ColumnDef } from '@tanstack/react-table'

export type Log = {
    date: string
    timeIn: string
    timeOut: string
    totalTimeWorked: string
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
        accessorKey: 'totalTimeWorked',
        header: 'Total Time Worked',
    },
]
