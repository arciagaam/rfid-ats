import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import RfidActions from './rfidactions'
import { SelectUserComboBox } from './actions/combobox'

export type Log = {
    id: string
    rfidTag: string
    user: string
    assignedTo: string
    status: string
}

export interface IRfidRow extends Log {
    _id: string
}

export const columns = (loadingRfids: boolean): ColumnDef<Log>[] => [
    {
        accessorKey: 'rfidTag',
        header: 'RFID Tag',
        size: 200,
    },
    {
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        cell: ({ row }) => {
            const id = row.original.user
            const rfidTag = row.original.rfidTag

            return <SelectUserComboBox userId={id} rfidTag={rfidTag} loadingRfids={loadingRfids} />
        },
        size: 300,
    },
    {
        accessorKey: 'status',
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
        cell: ({ row }) => {
            const status: string = row.getValue('status')
            return (
                <Badge
                    className={`${
                        status == 'not assigned'
                            ? 'border-yellow-300 text-yellow-500'
                            : 'border-green-500 text-green-500'
                    } bg-transparent font-thin hover:bg-transparent`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const log = row.original

            return <RfidActions rfidId={log.id} />
        },
        size: 100,
    },
]
