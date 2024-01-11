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

import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { IErrorResponse } from '@/types/index'

import { cn, toBase64 } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import {
    useRegisterMutation,
    useGetUserQuery,
    useUpdateUserByIDMutation,
    useUpdateUserProfileMutation,
    useGetProfileQuery,
} from '@/slices/usersApiSlice'

import { Label } from '@radix-ui/react-label'
import AddRfidModal from '@/pages/admin/users/rfid/addRfid/addrfids'

type IUserFormProps = {
    isEdit?: boolean
    closeDialog?: () => void
    userId?: string
}

const UserForm: React.FC<IUserFormProps> = ({ isEdit, closeDialog, userId }) => {
    const [register, { isLoading: loadingRegister }] = useRegisterMutation()
    const [updateUserById, { isLoading: loadingEditUser }] = useUpdateUserByIDMutation()
    const [updateUserProfile, { isLoading: loadingEditUserProfile }] =
        useUpdateUserProfileMutation()
    const [image, setImage] = useState<File | null>(null)

    const { id } = useParams() as { id: string }

    const { userInfo } = useSelector((state: RootState) => state.auth)

    const isAdmin = userInfo?.role === 'admin'

    const { data: user, refetch } = useGetUserQuery(id)
    const { data: userLoggedInProfile, refetch: refetchProfile } = useGetProfileQuery(userId)
    const [selectedRole, setSelectedRole] = useState<string>(user?.role)
    const [selectedSex, setSelectedSex] = useState<string>(user?.sex)
    const [selectedRfid, setSelectedRfid] = useState<string>(user?.rfid || null)

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: isEdit ? (isAdmin ? user?.firstName : userLoggedInProfile?.firstName) : '',
            middleName: isEdit
                ? isAdmin
                    ? user?.middleName
                    : userLoggedInProfile?.middleName
                : '',
            lastName: isEdit ? (isAdmin ? user?.lastName : userLoggedInProfile?.lastName) : '',
            email: isEdit ? (isAdmin ? user?.email : userLoggedInProfile?.email) : '',
            password: isEdit ? (isAdmin ? user?.password : userLoggedInProfile?.password) : '',
            role: isEdit ? (isAdmin ? user?.role : userLoggedInProfile?.role) : selectedRole,
            idNumber: isEdit ? (isAdmin ? user?.idNumber : userLoggedInProfile?.idNumber) : '',
            birthdate: isEdit
                ? isAdmin
                    ? new Date(user.birthdate!)
                    : new Date(userLoggedInProfile.birthdate!)
                : undefined,
            sex: isEdit ? (isAdmin ? user?.sex : userLoggedInProfile?.sex) : selectedSex,
            contactNumber: isEdit
                ? isAdmin
                    ? user?.contactNumber
                    : userLoggedInProfile?.contactNumber
                : '',
            address: isEdit ? (isAdmin ? user?.address : userLoggedInProfile?.address) : '',
            status: isEdit ? (isAdmin ? user?.status : userLoggedInProfile?.status) : '',
            profilePicture: '',
        },
    })

    const handleUserSubmit = async (
        firstName: string,
        middleName: string | null,
        lastName: string,
        email: string,
        role: string,
        idNumber: string | null,
        birthdate: Date | null,
        sex: string | null,
        contactNumber: string | null,
        address: string | null,
        password?: string,
        profilePicture?: string | null
    ) => {
        try {
            let birthdateISO = null

            if (birthdate) {
                const formattedBirthdate = format(birthdate!, 'yyyy-MM-dd')
                birthdateISO = new Date(formattedBirthdate).toISOString()
            }
            const status = selectedRfid ? 'active' : 'no assigned RFID'

            if (!isEdit) {
                if (selectedRfid === null) {
                    toast.error('Please add an RFID')
                    return
                }

                await register({
                    firstName,
                    middleName,
                    lastName,
                    email,
                    role,
                    status,
                    idNumber,
                    rfid: selectedRfid || null,
                    birthdate: birthdateISO,
                    sex,
                    contactNumber,
                    address,
                    password,
                    profilePicture,
                }).unwrap()

                toast.success('User successfully registered')
            } else {
                if (userInfo?.role === 'admin') {
                    await updateUserById({
                        userId: id as string,
                        firstName,
                        middleName,
                        lastName,
                        email,
                        role,
                        status,
                        idNumber,
                        rfid: selectedRfid || null,
                        birthdate: birthdateISO,
                        sex,
                        contactNumber,
                        address,
                        password,
                        profilePicture,
                    }).unwrap()

                    refetch()
                } else {
                    await updateUserProfile({
                        userId: id as string,
                        firstName,
                        middleName,
                        lastName,
                        email,
                        role,
                        status,
                        idNumber,
                        rfid: selectedRfid || null,
                        birthdate: birthdateISO,
                        sex,
                        contactNumber,
                        address,
                        password,
                        profilePicture,
                    }).unwrap()

                    refetchProfile()
                }

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
            birthdate,
            sex,
            contactNumber,
            address,
            password,
            profilePicture,
        } = data

        await handleUserSubmit(
            firstName,
            middleName || null,
            lastName,
            email,
            role,
            idNumber,
            birthdate,
            sex,
            contactNumber,
            address,
            password,
            profilePicture
        )
    }

    const handleAdminSubmit = async (data: z.infer<typeof adminUser>) => {
        const { firstName, middleName, lastName, email, password, profilePicture } = data
        await handleUserSubmit(
            firstName,
            middleName || null,
            lastName,
            email,
            'admin',
            null, // idNumber
            null, // birthdate
            null, // sex
            null, // contactNumber
            null, // address
            password,
            profilePicture
        )
    }

    const handleRfidSelection = (selectedValue: string) => {
        setSelectedRfid(selectedValue.toUpperCase())
    }

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        const payload = data
        if (image) {
            const base64 = await toBase64(image)
            Object.assign(payload, { profilePicture: base64 })
        }

        if (data.role === 'admin') {
            await handleAdminSubmit(payload)
        } else {
            await handleFacultySubmit(payload)
        }
    }

    const onResetPassword = async () => {
        if (user?.role === 'admin' && user?.birthdate === null) {
            await updateUserById({
                userId: id as string,
                password: 'p@55w0rd',
            }).unwrap()

            toast.success('Password successfully reset')
            refetch()
        } else {
            if (user) {
                const formattedBirthdate = format(new Date(user!.birthdate!), 'yyyy-MM-dd')

                await updateUserById({
                    userId: id as string,
                    password: formattedBirthdate,
                }).unwrap()

                refetchProfile()
            } else {
                const formattedBirthdate = format(new Date(user!.birthdate!), 'yyyy-MM-dd')

                await updateUserProfile({
                    userId: id as string,
                    password: formattedBirthdate,
                }).unwrap()

                refetch()
            }

            toast.success('Password successfully reset')
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target
        const file = target.files?.[0]

        if (file === undefined) return

        setImage(file)
    }

    return (
        <div className='flex flex-col gap-10'>
            <div className='col-span-3'>
                <Label>Profile Picture</Label>
                <Input
                    accept='image/jpg, image/jpeg, image/png, image/webp'
                    type='file'
                    className='w-full cursor-pointer'
                    onChange={handleFileChange}
                />
            </div>

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
                                        {isEdit && isAdmin ? (
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
                                                        {isAdmin && user?.role !== 'admin' ? (
                                                            <p>set to birthdate e.g. yyyy-mm-dd</p>
                                                        ) : (
                                                            <p>set to p@55w0rd</p>
                                                        )}
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
                                <FormItem className={isAdmin ? '' : 'hidden'}>
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
                                            <SelectItem value='part-time'>
                                                Part Time Faculty
                                            </SelectItem>
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

                                {isAdmin ? (
                                    <FormField
                                        name='rfid'
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* {isEdit ?? (
                                                    <span className='text-slate-400 text-xs ml-1'>
                                                        Optional
                                                    </span>
                                                )} */}

                                                {selectedRfid ? (
                                                    <>
                                                        <FormLabel className='text-base text-black'>
                                                            RFID
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={selectedRfid}
                                                                readOnly
                                                            />
                                                        </FormControl>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FormLabel className='text-base'>
                                                            RFID
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                <AddRfidModal
                                                                    rfidTag={selectedRfid}
                                                                    onSelect={handleRfidSelection}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    ''
                                )}

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

                                {isAdmin ? '' : <div></div>}

                                <FormField
                                    control={form.control}
                                    name='sex'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>Gender</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    setSelectedSex(value)
                                                }}
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
                        disabled={
                            isEdit
                                ? userLoggedInProfile
                                    ? loadingEditUserProfile
                                    : loadingEditUser
                                : loadingRegister
                        }
                        className='self-end w-fit'>
                        {isEdit ? (isAdmin ? 'Update User' : 'Update Profile') : 'Register User'}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default UserForm
