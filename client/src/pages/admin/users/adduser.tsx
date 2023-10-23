import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import UserForm from '../../../util/userform'
import { Button } from '@/components/ui/button'

const AddUserModal = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[80vh] min-w-[60%] overflow-scroll'>
                <DialogHeader>
                    <DialogTitle>Register User</DialogTitle>
                </DialogHeader>

                <UserForm />
            </DialogContent>
        </Dialog>
    )
}

export default AddUserModal
