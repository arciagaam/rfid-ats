import { ColumnDef } from '@tanstack/react-table'

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
    totalTimeWorked: string
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
        accessorKey: 'totalTimeWorked',
        header: 'Total Time Worked',
    },
]
