import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import { Link } from 'react-router-dom'

const Regular = () => {
  return (
    <div className='flex flex-col gap-10 text-[#1e1e1e]'>
      <div className='flex w-full justify-between'>
        <h1 className='text-xl font-bold'>Accomplishment Reports for Regular Faculty</h1>

        <Dialog>
            <DialogTrigger>
                <Button>Create Report</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[80vh] min-w-[60%] overflow-scroll'>
                <DialogHeader>
                    <DialogTitle>Create Report</DialogTitle>
                </DialogHeader>

                {/* <AddUserForm /> */}
            </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Regular