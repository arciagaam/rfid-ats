import React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { IErrorResponse } from '@/types/index'
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
import { useAssignRfidToUserMutation } from '@/slices/rfidApiSlice'
import { IUserSelect } from '@/types'

type SelectUserComboBoxProps = {
    userId?: string
    rfidTag?: string
    loadingRfids?: boolean
}

const SelectUserComboBox: React.FC<SelectUserComboBoxProps> = ({
    userId,
    rfidTag,
    loadingRfids,
}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(userId ?? null)

    const { data: users } = useGetUsersQuery('')
    const [assignRfid] = useAssignRfidToUserMutation()

    const selectUsers = users
        ? users.map((user: IUserSelect) => ({
              key: user._id,
              value: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
          }))
        : []

    const handleSelect = async (currentValue: string) => {
        const formattedCurrentValue = currentValue.trim().toLowerCase()

        const selectedUser = selectUsers.find(
            (user: IUserSelect) => user.value.trim().toLowerCase() === formattedCurrentValue
        )

        const userId = selectedUser?.key

        if (userId) {
            try {
                if (value === userId) {
                    await assignRfid({ rfidTag: rfidTag, userId: null }).unwrap()

                    toast.warning(`RFID Tag: ${rfidTag} unassigned to user.`)
                    return
                }

                await assignRfid({ rfidTag: rfidTag, userId: userId }).unwrap() // Use the extracted userId
                toast.success(`RFID Tag: ${rfidTag} assigned to user.`)
            } catch (error) {
                toast.error(
                    (error as IErrorResponse)?.data?.message || (error as IErrorResponse).error
                )
            } finally {
                setValue(userId === value ? null : userId)
                setOpen(false)
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[300px] justify-between'>
                    {loadingRfids ? (
                        <PulseLoader size={6} color='#1e1e1e50' />
                    ) : value ? (
                        selectUsers.find((user: IUserSelect) => user.key === value)?.value ??
                        'Select user...'
                    ) : (
                        'Select user...'
                    )}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] p-0'>
                <Command>
                    <CommandInput placeholder='Search user...' className='h-9' />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                        {selectUsers.map((user: IUserSelect) => (
                            <CommandItem key={user.key} value={user.value} onSelect={handleSelect}>
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

export { SelectUserComboBox }
