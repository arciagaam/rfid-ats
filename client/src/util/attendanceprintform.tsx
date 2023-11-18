import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { attendancePrintSchema } from '@/validators/attendancePrint'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useGetUserLogsByDateMutation } from '@/slices/usersApiSlice'
import { IErrorResponse } from '@/types'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
const AttendancePrintForm = () => {

    const [getUserLogsByDate, {isLoading}] = useGetUserLogsByDateMutation();
    const navigate = useNavigate();
    const form = useForm<z.infer<typeof attendancePrintSchema>>({
        resolver: zodResolver(attendancePrintSchema),
        defaultValues: {
            date: new Date()
        }
    })

    const onSubmit = async (date: Date) => {
        try {
            const res = await getUserLogsByDate({date});
            if(res) {
                localStorage.setItem('print', JSON.stringify(res));
                window.open(window.location.origin+'/attendance/print');
            }
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base'>Select date</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !field.value &&
                                                'text-muted-foreground'
                                            )}>
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {field.value ? (
                                                format(field.value, 'PPP')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align='start'
                                        className=' w-auto p-0'>
                                        <Calendar
                                            mode='single'
                                            captionLayout='dropdown-buttons'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            fromYear={1960}
                                            toYear={new Date().getFullYear()}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date('1900-01-01')
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />





                <Button
                    type='submit'
                    className='self-end w-fit'>
                    Print Attendance Records
                </Button>
            </form>
        </Form>
    )
}

export default AttendancePrintForm