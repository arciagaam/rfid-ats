import { ColumnDef } from '@tanstack/react-table'

// import UserActions from './useractions'

export type Log = {
    date: string
    timeIn: string
    timeOut: string
    hoursWorked: string
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
        accessorKey: 'hoursWorked',
        header: 'Hours Worked',
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => {
    //         const log = row.original

    //         return <UserActions userId={log.id} />
    //     },
    // },
]
