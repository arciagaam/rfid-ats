import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { useWindowStateMutation } from '@/slices/rfidApiSlice'
import { useEffect, useRef, useState } from 'react'
import { BsPersonVcardFill } from 'react-icons/bs'

import { DataTable } from '@/components/global/datatable/dataTable'
import { columns, Log, IRfidRow } from './columns'

const AddRfidModal = () => {
    const [data, setData] = useState<Log[]>([])

    const dialogRef = useRef(null)
    const [windowState] = useWindowStateMutation()
    let timeout: ReturnType<typeof setTimeout>

    const openModal = async (open: boolean) => {
        if (open) {
            const dialog = dialogRef.current as null | HTMLElement
            clearTimeout(timeout)
            //If ref is null
            if (!dialog) {
                timeout = setTimeout(() => {
                    openModal(open)
                }, 10)
                return
            }

            try {
                await windowState({ windowState: 'open' })
            } catch (error) {
                console.warn(error)
            }

            timeout = setTimeout(() => {
                openModal(open)
            }, 10000)

            return
        } else {
            await windowState({ windowState: 'closed' })
            setData([])
        }
    }

    return (
        <Dialog onOpenChange={openModal}>
            <DialogTrigger asChild>
                <Button>Add Rfid/s</Button>
            </DialogTrigger>
            <DialogContent ref={dialogRef} className='max-h-[80vh] min-w-[60%]'>
                <DialogHeader>
                    <DialogTitle>Add Rfid/s</DialogTitle>
                </DialogHeader>

                <div className='flex flex-col w-full items-center justify-center'>
                    <div className='relative flex flex-col  w-fit items-center p-20'>
                        <BsPersonVcardFill size={150} color='#3657ff' />
                        <h2 className='text-base'>Tap the RFID card to add.</h2>
                    </div>
                </div>
                {/* <div className='flex flex-col w-full mt-[-20px]'>
                    <DataTable columns={columns()} data={data} noPagination={true} />
                    <Button
                        type='submit'
                        // disabled={
                        //     isEdit
                        //         ? userProfile
                        //             ? loadingEditUserProfile
                        //             : loadingEditUser
                        //         : loadingRegister
                        // }
                        className='self-end mt-10 w-24'>
                        Save
                    </Button>
                </div> */}
            </DialogContent>
        </Dialog>
    )
}

export default AddRfidModal
