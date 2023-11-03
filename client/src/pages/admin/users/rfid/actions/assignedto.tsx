import React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useGetUsersQuery } from '@/slices/usersApiSlice'
import { IUserSelect } from '@/types'

export function ComboboxDemo() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('')

    const { data: users } = useGetUsersQuery('')
    // console.log(users)

    const selectUsers = users
        ? users.map((user: IUserSelect) => ({
              key: user._id,
              value: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
              label: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
          }))
        : []

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'>
                    {value
                        ? selectUsers.find((user: IUserSelect) => user.key === value)?.label
                        : 'Select user'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search user...' className='h-9' />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                        {selectUsers &&
                            selectUsers.map((user: IUserSelect) => (
                                <CommandItem
                                    key={user.key}
                                    value={user.key}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? '' : currentValue)
                                        console.log(currentValue)
                                        setOpen(false)
                                    }}>
                                    {user.label}
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
