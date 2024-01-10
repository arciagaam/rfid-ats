import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { useWindowStateMutation } from '@/slices/rfidApiSlice'
import React, { useEffect, useRef, useState } from 'react'
import { BsPersonVcardFill } from 'react-icons/bs'

import { DataTable } from '@/components/global/datatable/dataTable'
import { columns, IRfidItem } from './columns'

import { toast } from 'react-toastify'
import { PropagateLoader } from 'react-spinners'

import { io } from 'socket.io-client'
import { API_BASE_URL } from '@/constants/constants'

interface AddRfidModalProps {
    rfidTag: string
    onSelect: (selectedValue: string) => void
}

const AddRfidModal: React.FC<AddRfidModalProps> = ({ rfidTag, onSelect }) => {
    const [value, setValue] = React.useState(rfidTag ?? null)

    const [rfidData, setRfidData] = useState<{ temporaryRfidData: IRfidItem[] }>({
        temporaryRfidData: [],
    })

    const dialogRef = useRef(null)
    const [windowState] = useWindowStateMutation()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const openModal = async (open: boolean) => {
        if (open === true) {
            console.log('open')
            try {
                await windowState({ windowState: 'open' })
            } catch (error) {
                console.warn(error)
            }
        } else {
            console.log('closed')
            await windowState({ windowState: 'closed' })
            setIsDialogOpen(false)
        }
    }

    useEffect(() => {
        const socket = io(API_BASE_URL)

        socket.on('temporary_rfid_data', (content) => {
            setRfidData(content)
        })

        socket.on('success', (content) => {
            toast.dismiss()
            toast.success(content.message)
        })

        socket.on('warning', (content) => {
            toast.dismiss()
            toast.warning(content.message)
        })

        socket.on('error', (content) => {
            toast.dismiss()
            toast.error(content.message)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const handleSubmit = async (rfidData: IRfidItem[]) => {
        setValue(rfidData[0].rfidTag)
        onSelect(rfidData[0].rfidTag)
        openModal(false)
        toast.dismiss()
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={openModal}>
            <DialogTrigger
                asChild
                onClick={() => {
                    setIsDialogOpen(true)
                    toast.dismiss()
                }}
                className='w-full'>
                <Button>Add Rfid</Button>
            </DialogTrigger>
            <DialogContent ref={dialogRef} className='max-h-[80vh] min-w-[60%]'>
                <DialogHeader>
                    <DialogTitle>Add Rfid</DialogTitle>
                </DialogHeader>

                {rfidData.temporaryRfidData.length > 0 ? (
                    <div className='flex flex-col w-full mt-[-20px]'>
                        <DataTable
                            columns={columns}
                            initialPageSize={5}
                            noPagination
                            data={rfidData.temporaryRfidData}
                        />
                        <Button
                            type='submit'
                            onClick={() => handleSubmit(rfidData.temporaryRfidData)}
                            className='self-end mt-10 w-24'>
                            Continue
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col w-full items-center justify-center'>
                        <div className='relative flex flex-col  w-fit items-center p-20'>
                            <BsPersonVcardFill size={150} color='#3657ff' />
                            <h2 className='text-base mb-3'>Tap the RFID card to assign.</h2>
                            <PropagateLoader size={11} speedMultiplier={0.75} color='#3657ff' />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddRfidModal
