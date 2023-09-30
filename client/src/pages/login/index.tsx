import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useLoginMutation } from '@/slices/usersApiSlice'
import { setCredentials } from '@/slices/authSlice'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

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

interface ErrorResponse {
    status: number
    data: {
        message: string
        stack: string
    }
}

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate('/admin')
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
        console.log(data)
        const { email, password } = data

        try {
            const res = await login({ email, password }).unwrap()
            dispatch(setCredentials({ ...res }))
            //navigate('/admin')
        } catch (error) {
            //toast.error(error?.data?.message || error.error)
            toast.error((error as ErrorResponse)?.data?.message)
            // toast.error('Error')
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen gap-10'>
            <div className='flex flex-col items-center w-1/2 gap-10 p-10 border rounded-lg'>
                <div className='flex items-center gap-5'>
                    <div className='h-20 bg-blue-500 rounded-full min-h-1 aspect-square'></div>
                    <h1>College Of Industrial Technology</h1>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col w-full gap-3'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
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
                                    <FormLabel>Password</FormLabel>
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

                        <div className='flex items-center gap-2 mt-3'>
                            <Checkbox id='remember_me' name='remember_me' />
                            <Label htmlFor='remember_me'>Remember Me</Label>
                        </div>

                        <Button type='submit' disabled={isLoading}>
                            Login
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Login