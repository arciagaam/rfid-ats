import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { useAddRfidWindowOpenQuery } from "@/slices/rfidApiSlice"
import { useEffect, useRef } from "react";


const AddRfidModal = () => {
    const dialogRef = useRef(null);

    const {openWindow, refetch} = useAddRfidWindowOpenQuery(null);
    let timeout: ReturnType<typeof setTimeout>;

    const openModal = async () => {
        const dialog = dialogRef.current as null | HTMLElement;
        clearTimeout(timeout);

        //If ref is null
        if (!dialog) {
            timeout = setTimeout(() => {
                openModal();
            }, 10);
            return;
        }

        //If modal is open
        if (dialog!.dataset.state == 'open') {
            try {
                refetch();
            } catch (error) {
                console.warn(error);
            }

            timeout = setTimeout(() => {
                openModal()
            }, 10000);
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button onClick={openModal}>Add Rfid/s</Button>
            </DialogTrigger>
            <DialogContent ref={dialogRef} className='max-h-[80vh] min-w-[60%] overflow-scroll'>
                <DialogHeader>
                    <DialogTitle>Add Rfid/s</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col">
                    
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddRfidModal