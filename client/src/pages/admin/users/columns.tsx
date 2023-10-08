import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export type Log = {
    name: string
    email: string
    role: string
    status: string
}

export interface IUserRow extends Log {
    firstName: string
    middleName: string
    lastName: string
}

export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
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

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='w-8 h-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='w-4 h-4' />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(log.id)}>
                            View User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
