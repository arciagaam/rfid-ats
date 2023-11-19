import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useLoginMutation } from '@/slices/usersApiSlice'
import { setCredentials } from '@/slices/authSlice'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import bg from '../../assets/images/santa-cruz.png'
import banner from '../../assets/images/banner.png'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Checkbox } from '@/components/ui/checkbox'
import { loginSchema } from '@/validators/auth'

import { IErrorResponse } from '@/types/index'
import { Card, CardContent } from '@/components/ui/card'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate('/admin/home')
        }
    }, [userInfo, navigate])

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        const { email, password } = data

        try {
            const res = await login({ email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            //navigate('/admin')
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    return (
        <div className='relative flex w-full max-h-screen h-screen text-[#1e1e1e] p-10 gap-5'>
            <div className="flex flex-col gap-5 w-1/2">

                <div className="relative flex flex-col h-full rounded-lg overflow-clip">
                    <div className="absolute inset-0 bg-black/10 flex">
                        <div className="bg-white/60 backdrop-blur-md h-fit self-end">
                            <img src={banner} alt="" className='object-contain'/>
                        </div>
                    </div>
                    <img src={bg} alt="" className='object-cover'/>

                </div>

                <div className="flex flex-col bg-primary-blue-500 rounded-lg p-10 gap-10 text-white">
                    <div className="flex flex-col">
                        <h2 className='font-normal text-2xl text-white/70'>Attendance monitoring is now easier with </h2>
                        <p className='text-7xl text-white font-black'>RFIDTrack Web</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="min-h-[1px] h-[1px] w-full bg-white"></div>
                        <p>An attendance monitoring system with the use of RFID technology.</p>
                    </div>
                </div>
            
            </div>

            <div className="flex flex-1 flex-col gap-5">

                <div className="flex bg-[#FAFAFA] rounded-lg p-10">
                    <h2 className='font-bold text-xl'>
                        Attendance Monitoring System
                    </h2>
                </div>

                <div className="flex flex-col flex-1 bg-[#FAFAFA] rounded-lg p-10 gap-10">
                    <h2 className='font-bold text-lg'>
                        Login to your account
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex flex-col w-full flex-1 gap-5'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-base'>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Enter email' {...field} />
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
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex items-center gap-2'>
                                <Checkbox id='remember_me' name='remember_me' />
                                <Label htmlFor='remember_me'>Remember Me</Label>
                            </div>

                            <Button type='submit' disabled={isLoading} className='shadow-md'>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </Form>
                </div>


            </div>

        </div>
    )
}

export default Login
