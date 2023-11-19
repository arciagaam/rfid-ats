import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

// import RfidActions from './actions/rfidactions'
import { SelectUserComboBox } from '../actions/combobox'

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

export const columns = (loadingRfids?: boolean): ColumnDef<Log>[] => [
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
        size: 200,
    },
]
