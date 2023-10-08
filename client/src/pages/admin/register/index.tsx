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

import { ErrorResponse } from '@/types/index'
import { useRegisterMutation } from '@/slices/usersApiSlice'
import { useDispatch } from 'react-redux'
import { stat } from 'fs'

const Register = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedRole, setSelectedRole] = useState<string>('')
    // console.log(selectedRole)

    const [register, { isLoading: loadingRegister }] = useRegisterMutation()

    const dispatch = useDispatch()

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
            const res = await register({
                firstName,
                middleName,
                lastName,
                email,
                password,
                role: selectedRole,
                status: rfid == '' ? 'not registered' : 'active',
                idNumber,
                rfid,
                birthdate,
                sex,
                contactNumber,
                address,
            }).unwrap()
            toast.success('User successfully registered')
            dispatch({ ...res })
        } catch (error) {
            toast.error((error as ErrorResponse)?.data?.message)
        }
    }

    return (
        <div className='flex flex-col gap-10'>
            <h1 className='text-xl font-bold'>Register User</h1>

            <div className='flex flex-col'>
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

                            <FormField
                                control={form.control}
                                name='middleName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base'>Middle Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter middle name'
                                                {...field}
                                                autoComplete='off'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='lastName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base'>Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter last name'
                                                {...field}
                                                autoComplete='off'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base'>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter email'
                                                {...field}
                                                autoComplete='off'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base'>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                placeholder='Enter password'
                                                {...field}
                                                autoComplete='new-password'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='role'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base'>Role</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                setSelectedRole(value)
                                            }}
                                            defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select user role' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='admin'>Admin</SelectItem>
                                                <SelectItem value='faculty'>Faculty</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {selectedRole == 'faculty' ? (
                            <div className='grid grid-cols-3 gap-5 w-full'>
                                <FormField
                                    control={form.control}
                                    name='idNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>ID Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter ID Number' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='rfid'
                                    render={({ field }) => (
                                        <FormItem className='col-span-2'>
                                            <FormLabel className='text-base'>
                                                RFID{' '}
                                                <span className='text-slate-400 text-xs ml-1'>
                                                    Optional
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                {/* gawing disabled to pag may pantap na or pwede naman tap or enter*/}
                                                <Input placeholder='Tap or Enter RFID' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='birthdate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>Birthdate</FormLabel>
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
                                                    <PopoverContent className='w-auto p-0'>
                                                        <Calendar
                                                            mode='single'
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() ||
                                                                date < new Date('1900-01-01')
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='sex'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>Sex</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select sex' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='male'>Male</SelectItem>
                                                    <SelectItem value='female'>Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='contactNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>
                                                Contact Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter Contact Number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='address'
                                    render={({ field }) => (
                                        <FormItem className='col-span-3'>
                                            <FormLabel className='text-base'>Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Enter Address' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : null}

                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? 'Please wait...' : 'Register User'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Register
