import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { useWindowStateMutation } from "@/slices/rfidApiSlice"
import { useEffect, useRef, useState } from "react";
import {BsPersonVcardFill} from 'react-icons/bs'


const AddRfidModal = () => {
    const dialogRef = useRef(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [windowState] = useWindowStateMutation();
    let timeout: ReturnType<typeof setTimeout>;

    const openModal = async (open: boolean) => {
        if(open) {
            const dialog = dialogRef.current as null | HTMLElement;
            clearTimeout(timeout);
            //If ref is null
            if (!dialog) {
                timeout = setTimeout(() => {
                    openModal(open);
                }, 10);
                return;
            }
            
            try {
                await windowState({windowState: 'open'});
            } catch (error) {
                console.warn(error);
            }
    
            timeout = setTimeout(() => {
                openModal(open);
            }, 10000);

            return;
        }else{
            await windowState({windowState: 'closed'});
        }

    }

    return (
        <Dialog onOpenChange={openModal}>
            <DialogTrigger>
                <Button>Add Rfid/s</Button>
            </DialogTrigger>
            <DialogContent ref={dialogRef} className='max-h-[80vh] min-w-[60%] overflow-scroll'>
                <DialogHeader>
                    <DialogTitle>Add Rfid/s</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col w-full items-center justify-center">
                    <div className="relative flex flex-col  w-fit items-center p-20">
                        <BsPersonVcardFill size={150} color="#8d2ed1"/>
                        <h2 className="text-base">Tap the RFID card to add.</h2>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddRfidModal