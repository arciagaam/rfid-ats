import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
import { registerSchema, adminUser, facultyUser } from '@/validators/register'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { IErrorResponse } from '@/types/index'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import {
    useRegisterMutation,
    useGetUserQuery,
    useUpdateUserByIDMutation,
} from '@/slices/usersApiSlice'

type IUserFormProps = {
    isEdit?: boolean
    closeDialog?: () => void
}

const UserForm: React.FC<IUserFormProps> = ({ isEdit, closeDialog }) => {
    const [register, { isLoading: loadingRegister }] = useRegisterMutation()
    const [updateUser, { isLoading: loadingEditUser }] = useUpdateUserByIDMutation()

    const { id } = useParams()
    const { data: user, refetch } = useGetUserQuery(id as string)
    const [selectedRole, setSelectedRole] = useState<string>(user?.role)

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: isEdit ? user?.firstName : '',
            middleName: isEdit ? user?.middleName : '',
            lastName: isEdit ? user?.lastName : '',
            email: isEdit ? user?.email : '',
            password: isEdit ? user?.password : '',
            role: isEdit ? user?.role : selectedRole,
            idNumber: isEdit ? user?.idNumber : '',
            rfid: isEdit ? user?.rfid : '',
            birthdate: isEdit ? new Date(user!.birthdate!) : undefined,
            sex: isEdit ? user?.sex : '',
            contactNumber: isEdit ? user?.contactNumber : '',
            address: isEdit ? user?.address : '',
            status: isEdit ? user?.status : '',
        },
    })

    const handleUserSubmit = async (
        firstName: string,
        middleName: string | null,
        lastName: string,
        email: string,
        role: string,
        idNumber: string | null,
        rfid: string | null,
        birthdate: Date | null,
        sex: string | null,
        contactNumber: string | null,
        address: string | null,
        password?: string
    ) => {
        try {
            let birthdateISO = null
            if (birthdate) {
                const formattedBirthdate = format(birthdate!, 'yyyy-MM-dd')
                birthdateISO = new Date(formattedBirthdate).toISOString()
            }
            const status = rfid === null ? 'not registered' : 'active'

            if (!isEdit) {
                await register({
                    firstName,
                    middleName,
                    lastName,
                    email,
                    role,
                    status,
                    idNumber,
                    rfid,
                    birthdate: birthdateISO,
                    sex,
                    contactNumber,
                    address,
                    password,
                }).unwrap()

                toast.success('User successfully registered')
            } else {
                await updateUser({
                    userId: id as string,
                    firstName,
                    middleName,
                    lastName,
                    email,
                    role,
                    status,
                    idNumber,
                    rfid,
                    birthdate: birthdateISO,
                    sex,
                    contactNumber,
                    address,
                    password,
                }).unwrap()

                refetch()
                toast.success('User successfully updated')
            }

            form.reset({})
            closeDialog!()
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    const handleFacultySubmit = async (data: z.infer<typeof facultyUser>) => {
        const {
            firstName,
            middleName,
            lastName,
            email,
            role,
            idNumber,
            rfid,
            birthdate,
            sex,
            contactNumber,
            address,
            password,
        } = data

        await handleUserSubmit(
            firstName,
            middleName || null,
            lastName,
            email,
            role,
            idNumber,
            rfid || null,
            birthdate,
            sex,
            contactNumber,
            address,
            password
        )
    }

    const handleAdminSubmit = async (data: z.infer<typeof adminUser>) => {
        const { firstName, middleName, lastName, email, password } = data

        await handleUserSubmit(
            firstName,
            middleName || null,
            lastName,
            email,
            'admin',
            null,
            null,
            null,
            null,
            null,
            null,
            password
        )
    }

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        console.log(data)
        if (data.role === 'admin') {
            await handleAdminSubmit(data)
        }else {
            await handleFacultySubmit(data)
        }
    }

    const onResetPassword = async () => {
        if (user?.role === 'admin' && user?.birthdate === null) {
            await updateUser({
                userId: id as string,
                password: 'adminCCS',
            }).unwrap()
            toast.success('Password successfully reset')
            refetch()
        } else {
            const formattedBirthdate = format(new Date(user!.birthdate!), 'yyyy-MM-dd')

            await updateUser({
                userId: id as string,
                password: formattedBirthdate,
            }).unwrap()
            toast.success('Password successfully reset')
            refetch()
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
                                        {isEdit ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type='button'
                                                            className='w-full bg-gray-600 hover:bg-slate-500'
                                                            onClick={onResetPassword}>
                                                            reset
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side='bottom'>
                                                        <p>set to birthdate e.g. 1995-10-20</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Input
                                                type='password'
                                                placeholder='Enter password'
                                                {...field}
                                                autoComplete='new-password'
                                            />
                                        )}
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
                                            <SelectItem value='regular'>Regular Faculty</SelectItem>
                                            <SelectItem value='part-time'>Part Time Faculty</SelectItem>
                                            <SelectItem value='admin'>Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {selectedRole != 'admin' ? (
                        <>
                            <br />

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
                                        <FormItem>
                                            <FormLabel className='text-base'>
                                                RFID{' '}
                                                <span className='text-slate-400 text-xs ml-1'>
                                                    Optional
                                                </span>
                                            </FormLabel>
                                            <FormControl>
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

                                <FormField
                                    control={form.control}
                                    name='sex'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>Gender</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select gender' />
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
                                                <div className='flex items-center bg-white rounded-md focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2'>
                                                    <div className='text-[#1e1e1e80] flex items-center justify-center text-sm rounded-l-md pl-3 border border-input ring-offset-background h-10 border-r-0 py-2'>
                                                        +63
                                                    </div>
                                                    <Input
                                                        className='border-l-0 rounded-l-none w-full focus-visible:ring-0 focus-visible:ring-offset-0'
                                                        placeholder='Enter Contact Number'
                                                        {...field}
                                                    />
                                                </div>
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
                        </>
                    ) : null}

                    <Button
                        type='submit'
                        disabled={isEdit ? loadingEditUser : loadingRegister}
                        className='self-end w-fit'>
                        {isEdit ? 'Update User' : 'Register User'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default UserForm
