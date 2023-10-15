import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'


const AddRfidModal = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Add Rfid/s</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[80vh] min-w-[60%] overflow-scroll'>
                <DialogHeader>
                    <DialogTitle>Add Rfid/s</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col">
                    Tap card to add.
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddRfidModal