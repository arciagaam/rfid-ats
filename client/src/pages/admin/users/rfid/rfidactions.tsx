import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"


const RfidActions = () => {
    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='w-8 h-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='w-4 h-4' />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem>
                        View User
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem disabled={loadingDelete}>
                        <DialogTrigger>Delete User</DialogTrigger>
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        Do you want to delete the entry? Deleting this entry cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => handleDeleteUser(userId)} disabled={loadingDelete}>
                        {loadingDelete ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent> */}
        </Dialog>
    )
}

export default RfidActions