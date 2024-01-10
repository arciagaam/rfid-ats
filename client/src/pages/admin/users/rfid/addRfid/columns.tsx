import { ColumnDef } from '@tanstack/react-table'

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
