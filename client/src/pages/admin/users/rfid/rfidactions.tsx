import React from 'react'

import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { useGetRfidsQuery, useDeleteRfidMutation } from '@/slices/rfidApiSlice'

import { toast } from 'react-toastify'
import { IErrorResponse } from '@/types/index'

const RfidActions = ({ rfidId }: { rfidId: string }) => {
    const [open, setOpen] = React.useState(false)

    const [deleteRfid, { isLoading: loadingDelete }] = useDeleteRfidMutation()

    const { refetch } = useGetRfidsQuery(null)

    const handleDeleteRfid = async (rfidId: string) => {
        try {
            await deleteRfid(rfidId)
            refetch()
            toast.success('Rfid deleted successfully')

            setOpen(false)
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Trash2 className='w-4 h-4 text-red-500' />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        Do you want to delete the entry? Deleting this entry cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => handleDeleteRfid(rfidId)} disabled={loadingDelete}>
                        {loadingDelete ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RfidActions
