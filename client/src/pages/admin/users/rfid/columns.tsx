import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import RfidActions from './actions/rfidactions'
import { ComboboxDemo } from './actions/assignedto'

export type Log = {
    id: string
    rfidTag: string
    assignedTo: string
    status: string
}

export interface IRfidRow extends Log {
    _id: string
    rfidTag: string
    status: string
}

export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: 'rfidTag',
        header: 'RFID Tag',
    },
    {
        accessorKey: 'assignedTo',
        header: 'Assigned to',
        cell: ({ row }) => {
            return <ComboboxDemo />
        },
    },
    {
        accessorKey: 'status',
        cell: ({ row }) => {
            const status: string = row.getValue('status')
            return (
                <Badge
                    className={`${
                        status == 'unused'
                            ? 'border-yellow-300 text-gray-500'
                            : 'border-red-500 text-red-500'
                    } bg-yellow-300 font-thin hover:bg-transparent`}>
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
    // {
    //     id: 'actions',
    //     cell: ({ row }) => {
    //         const log = row.original

    //         return <RfidActions userId={log.id} />
    //     },
    // },
]
