import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import AccomplishmentReportActions from './accomplishmentReportActions'

export type ArUsers = {
    name: string
    email: string
    pending: { status: boolean }
}
export const columns: ColumnDef<ArUsers>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    className='p-0'
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className='w-4 h-4 ml-2' />
                </Button>
            )
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'pending',
        header: 'Status',
        cell: ({ row }) => {
            const pending = row.original.pending

            return (
                <Badge
                    className={`${
                        pending.status === true
                            ? 'border-red-500 text-red-500'
                            : 'border-green-500 text-green-500'
                    } bg-transparent font-thin hover:bg-transparent`}>
                    {pending.status === true ? 'Pending' : 'Done'}
                </Badge>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const log = row.original

            return <AccomplishmentReportActions userId={log.id} />
        },
    },
]
