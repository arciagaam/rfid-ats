import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'

import { useNotifyUserMutation } from '@/slices/accomplishmentReportApiSlice'
import { useGetUsersQuery } from '@/slices/usersApiSlice'

import { toast } from 'react-toastify'
import { IErrorResponse } from '@/types/index'

interface IProps {
    userId: string
}

const AccomplishmentReportActions: React.FC<IProps> = ({ userId }) => {
    const [open, setOpen] = React.useState(false)
    const type = Array.from(location.pathname.split('/')).at(-1)

    const [notifyUser, { isLoading: loadingNotify }] = useNotifyUserMutation()
    const { refetch } = useGetUsersQuery(`role=${type}&status=active`)

    const schema = z.object({
        deadline: z.date(),
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            deadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const { deadline } = data

        const formmattedDeadline = format(deadline, 'yyyy-MM-dd')
        const deadlineIS0 = new Date(formmattedDeadline).toISOString()

        try {
            await notifyUser({ userId, deadline: deadlineIS0 }).unwrap()

            setOpen(false)
            toast.success('Successfully notified user')

            form.reset()
            refetch()
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='w-8 h-8 p-0 bg-[#d6ddff] text-slate-600 hover:text-white'>
                        <span className='sr-only'>Open menu</span>
                        <ChevronDown className='w-4 h-4' />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem>
                        <Link to={userId}>View Reports</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <DialogTrigger>Notify AR</DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Deadline</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='pt-7'>
                        <FormField
                            control={form.control}
                            name='deadline'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !field.value && 'text-muted-foreground'
                                                    )}>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align='start' className=' w-auto p-0'>
                                                <Calendar
                                                    mode='single'
                                                    captionLayout='dropdown-buttons'
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    fromYear={1960}
                                                    toYear={new Date().getFullYear()}
                                                    disabled={(date) => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type='submit' className='mt-4 self-end w-fit'>
                                Notify
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AccomplishmentReportActions
