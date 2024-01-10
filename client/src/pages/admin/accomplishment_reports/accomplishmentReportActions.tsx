import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const AccomplishmentReportActions = ({ userId }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='w-8 h-8 p-0 bg-[#d6ddff] text-slate-600 hover:text-white'>
                        <span className='sr-only'>Open menu</span>
                        <ChevronDown className='w-4 h-4' />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem>
                        <Link to={userId}>View Reports</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    )
}

export default AccomplishmentReportActions
