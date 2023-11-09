import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UserActions from './useractions'

export type Log = {
    id: string
    name: string
    email: string
    role: string
    status: string
}

export interface IUserRow extends Log {
    _id: string
    firstName: string
    middleName: string
    lastName: string
}

export const columns: ColumnDef<Log>[] = [
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
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'status',
        cell: ({ row }) => {
            const status: string = row.getValue('status')

            return (
                <Badge
                    className={`${
                        status == 'active'
                            ? 'border-green-500 text-green-500'
                            : 'border-red-500 text-red-500'
                    } bg-transparent font-thin hover:bg-transparent`}>
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
    {
        id: 'actions',
        cell: ({ row }) => {
            const log = row.original

            return <UserActions userId={log.id} />
        },
    },
]
