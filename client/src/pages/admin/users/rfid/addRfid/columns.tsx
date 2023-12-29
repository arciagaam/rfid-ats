import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

// import RfidActions from './actions/rfidactions'
import { SelectUserComboBox } from '../actions/combobox'

export interface IRfidItem {
    rfidTag: string
}

export const columns: ColumnDef<IRfidItem>[] = [
    {
        accessorKey: 'rfidTag',
        header: 'RFID Tag',
        size: 200,
    },
]
