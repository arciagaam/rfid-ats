import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface IFormModalProps {
    btnLabel: string
    dlgTitle: string
    formComponent: React.ReactNode
}

const FormModalBtn: React.FC<IFormModalProps> = ({ btnLabel, dlgTitle, formComponent }) => {
    const [open, setOpen] = React.useState(false)

    const closeDialog = () => {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{btnLabel}</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] min-w-[60%] max-w-[90vw] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{dlgTitle}</DialogTitle>
                </DialogHeader>

                {React.cloneElement(formComponent as React.ReactElement, { closeDialog })}
            </DialogContent>
        </Dialog>
    )
}

export { FormModalBtn }
