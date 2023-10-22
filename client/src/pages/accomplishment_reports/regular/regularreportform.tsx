import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/validators/register'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { IErrorResponse } from '@/types/index'
import { useRegisterMutation } from '@/slices/usersApiSlice'

const RegularReportForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedRole, setSelectedRole] = useState<string>('')

    const [register, { isLoading: loadingRegister }] = useRegisterMutation()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            password: '',
            role: selectedRole,
            idNumber: '',
            rfid: '',
            sex: '',
            contactNumber: '',
            address: '',
            status: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        const {
            firstName,
            middleName,
            lastName,
            email,
            password,
            idNumber,
            rfid,
            birthdate,
            sex,
            contactNumber,
            address,
        } = data
        
        try {
            let birthdateISO;
            if(birthdate) {
                const formattedBirthdate = format(birthdate!, 'yyyy-MM-dd')
                birthdateISO = new Date(formattedBirthdate).toISOString()
            }

            await register({
                firstName,
                middleName,
                lastName,
                email,
                password,
                role: selectedRole,
                status: rfid == '' ? 'not registered' : 'active',
                idNumber,
                rfid,
                birthdate: birthdateISO,
                sex,
                contactNumber,
                address,
            }).unwrap()
            form.reset({});
            
            toast.success('User successfully registered')
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    return (
        <div className='flex flex-col gap-10'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <div className='grid grid-cols-3 w-full gap-5'>
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base'>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter first name'
                                            {...field}
                                            autoComplete='new-password'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button type='submit' disabled={isLoading} className='self-end w-fit'>
                        {loadingRegister ? 'Please wait...' : 'Register User'}
                    </Button>
                </form>
            </Form>

        </div>
    )
}

export default RegularReportForm
