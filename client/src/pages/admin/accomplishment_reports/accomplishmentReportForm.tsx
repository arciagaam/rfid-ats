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
import { toast } from 'react-toastify'

import { Input } from '@/components/ui/input'
import { useStoreAccomplishmentReportMutation } from '@/slices/accomplishmentReportApiSlice'
import { accomplishmentReportSchema } from '@/validators/accomplishmentReport'
import SelectUsers from './selectusers'
import { IErrorResponse } from '@/types'
import { useLocation } from 'react-router-dom'

const AccomplishmentReportForm = () => {
    const location = useLocation();
    const type = Array.from(location.pathname.split('/')).at(-1);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userList, setUserList] = useState<Array<object>>([]);

    const [storeAccomplishmentReport, { isLoading: loadingRegister }] = useStoreAccomplishmentReportMutation()

    const removeFromUserList = (user) => {
        setUserList((prev) => (prev.filter((item) => item._id!=user._id)))
    }

    const form = useForm<z.infer<typeof accomplishmentReportSchema>>({
        resolver: zodResolver(accomplishmentReportSchema),
        defaultValues: {
            title: '',
            users: userList,
            deadline: new Date(),
        },
    })

    const onSubmit = async (data: z.infer<typeof accomplishmentReportSchema>) => {
        const {
            title,
            deadline
        } = data

        const users = userList.map((user) => user._id);

        try {
            await storeAccomplishmentReport({
                title,
                users,
                deadline,
                type: type,
            }).unwrap();

            form.reset({});
            setUserList([]);

            toast.success('Accomplishment Report successfully posted')
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    return (
        <div className='flex flex-col gap-10'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <div className='flex flex-col w-full gap-5'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base'>Report Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter report title'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='deadline'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base'>Deadline</FormLabel>
                                    <FormControl>
                                        <Input type='datetime-local'/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <hr />

                        <SelectUsers userList={userList} setUserList={setUserList} removeFromUserList={removeFromUserList} />


                    </div>
                    <Button type='submit' disabled={isLoading} className='self-end w-fit'>
                        {loadingRegister ? 'Please wait...' : 'Create Report'}
                    </Button>
                </form>
            </Form>

        </div>
    )
}

export default AccomplishmentReportForm
