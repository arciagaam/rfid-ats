import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { SelectUserComboBox } from '../actions/combobox'

export interface IRfidItem {
    id: string
    rfidTag: string
}

export const columns: ColumnDef<IRfidItem>[] = [
    {
        accessorKey: 'rfidTag',
        header: 'RFID Tag',
        size: 200,
    },
]
