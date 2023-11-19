import React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { IErrorResponse, IRfidSelect } from '@/types/index'
import { PulseLoader } from 'react-spinners'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useGetUsersQuery } from '@/slices/usersApiSlice'
import { useGetRfidsQuery } from '@/slices/rfidApiSlice'

type SelectRfidComboBoxProps = {
    userId?: string
    rfidTag?: string
    loadingRfids?: boolean
}

const SelectRfidComboBox: React.FC<SelectRfidComboBoxProps> = ({ rfidTag, loadingRfids }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(null)

    // const { data: users } = useGetUsersQuery('')
    const { data: rfids } = useGetRfidsQuery('')

    console.log('rfids', rfids)

    const selectRfids = rfids
        ? rfids.map((rfid: IRfidSelect) => ({
              key: rfid._id,
              value: rfid.rfidTag,
          }))
        : []

    const handleSelect = async (currentValue: string) => {
        console.log('currentValue', currentValue)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between'>
                    {loadingRfids ? (
                        <PulseLoader size={6} color='#1e1e1e50' />
                    ) : value ? (
                        // this line finds the label of the selected value
                        selectRfids.find((rfid: IRfidSelect) => rfid._id === value)?.value
                    ) : (
                        'Select RFID...'
                    )}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[320px] p-0'>
                <Command>
                    <CommandInput placeholder='Search RFID...' className='h-9' />
                    <CommandEmpty>No RFID found.</CommandEmpty>
                    <CommandGroup>
                        {selectRfids.map((user: IRfidSelect) => (
                            <CommandItem
                                key={user.key}
                                value={user.key}
                                onSelect={handleSelect}
                                disabled>
                                {user.value}
                                <CheckIcon
                                    className={cn(
                                        'ml-auto h-4 w-4',
                                        value === user.key ? 'opacity-100' : 'opacity-0'
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { SelectRfidComboBox }
