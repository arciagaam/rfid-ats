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
import { columns, IRfidItem } from './columns'

import { toast } from 'react-toastify'
import { PropagateLoader } from 'react-spinners'

import { useSaveRfidMutation } from '@/slices/rfidApiSlice'

import { io } from 'socket.io-client'
import { API_BASE_URL } from '@/constants/constants'

const AddRfidModal = () => {
    const [saveRfid, { isLoading: loadingSaveRfid }] = useSaveRfidMutation()
    const [rfidData, setRfidData] = useState<{ temporaryRfidData: IRfidItem[] }>({
        temporaryRfidData: [],
    })
    // const [loading, setLoading] = useState(true)

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
            setRfidData({ temporaryRfidData: [] })
        }
    }

    useEffect(() => {
        const socket = io(API_BASE_URL)

        socket.on('temporary_rfid_data', (content) => {
            setRfidData(content)
        })

        socket.on('warning', (content) => {
            toast.warning(content.message)
        })

        socket.on('error', (content) => {
            toast.error(content.message)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    // console.log(rfidData)

    const handleSubmit = async (rfidData: IRfidItem[]) => {
        try {
            await saveRfid({ rfidData }).unwrap()

            toast.success('Rfid/s added successfully')
            openModal(false)
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong!')
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

                {rfidData.temporaryRfidData.length > 0 ? (
                    <div className='flex flex-col w-full mt-[-20px]'>
                        <DataTable
                            columns={columns}
                            initialPageSize={5}
                            data={rfidData.temporaryRfidData}
                        />
                        <Button
                            type='submit'
                            onClick={() => handleSubmit(rfidData.temporaryRfidData)}
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
                    </div>
                ) : (
                    <div className='flex flex-col w-full items-center justify-center'>
                        <div className='relative flex flex-col  w-fit items-center p-20'>
                            <BsPersonVcardFill size={150} color='#3657ff' />
                            <h2 className='text-base mb-3'>Tap the RFID card to add.</h2>
                            <PropagateLoader size={11} speedMultiplier={0.75} color='#3657ff' />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddRfidModal
