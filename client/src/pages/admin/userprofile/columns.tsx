import { ColumnDef } from '@tanstack/react-table'

export type Log = {
    _id: string
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
