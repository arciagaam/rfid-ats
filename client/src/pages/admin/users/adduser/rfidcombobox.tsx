import React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { IRfidSelect } from '@/types/index'
import { PulseLoader } from 'react-spinners'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useGetRfidsQuery } from '@/slices/rfidApiSlice'

type SelectRfidComboBoxProps = {
    userId?: string
    rfidTag: string
    loadingRfids?: boolean
    onSelect: (selectedValue: string) => void
    disabled?: boolean
}

const SelectRfidComboBox: React.FC<SelectRfidComboBoxProps> = ({
    onSelect,
    disabled,
    rfidTag,
    loadingRfids,
}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(rfidTag ?? null)

    const { data: rfids } = useGetRfidsQuery('')

    const selectRfids = rfids
        ? rfids
              .filter((rfid: IRfidSelect) => rfid.status === 'not assigned')
              .map((rfid: IRfidSelect) => ({
                  key: rfid._id,
                  value: rfid.rfidTag,
              }))
        : []

    const handleSelect = async (currentValue: string) => {
        onSelect(currentValue)
        setValue(currentValue)

        setOpen(false)
    }

    return (
        <Popover open={open} modal={true} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between'
                    disabled={disabled}>
                    {loadingRfids ? (
                        <PulseLoader size={6} color='#1e1e1e50' />
                    ) : value ? (
                        selectRfids.find((rfid: IRfidSelect) => rfid.key === value)?.value ?? value
                    ) : (
                        'Select RFID...'
                    )}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[320px] p-0'>
                <Command>
                    <CommandInput placeholder='Search RFID...' className='h-9' />
                    {/* <ScrollArea className='max-h-[200px] overflow-auto'> */}
                    <CommandEmpty>No RFID found.</CommandEmpty>
                    <CommandGroup className='max-h-[200px] overflow-auto'>
                        {selectRfids.map((user: IRfidSelect) => (
                            <CommandItem key={user.key} value={user.key} onSelect={handleSelect}>
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
                    {/* </ScrollArea> */}
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { SelectRfidComboBox }
