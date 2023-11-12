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
import { IErrorResponse } from '@/types'
import { useLocation } from 'react-router-dom'

const AccomplishmentReportForm = ({...props}) => {
    const {refetch} = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [storeAccomplishmentReport, { isLoading: loadingRegister }] = useStoreAccomplishmentReportMutation()

    const form = useForm<z.infer<typeof accomplishmentReportSchema>>({
        resolver: zodResolver(accomplishmentReportSchema),
        defaultValues: {
            title: '',
            file: null,
            link: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof accomplishmentReportSchema>) => {
        const {
            title,
            file,
            link
        } = data

        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('link', link);
        
        try {
            await storeAccomplishmentReport(formData).unwrap();

            form.reset({});
            refetch();

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

                        <hr />
                        
                        <FormField
                            control={form.control}
                            name='file'
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel className='text-base'>File</FormLabel>
                                    <FormControl className='cursor-pointer'>
                                        <Input {...field}
                                        type='file'
                                        value={value?.fileName}
                                        onChange={(e) => {
                                            console.log(e.target.files)
                                            onChange(e.target.files[0]);
                                        }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 items-center">
                            <div className="flex-1 min-h-[1px] h-[1px] w-full bg-black/10"></div>
                            <p className='text-black/50'>or</p>
                            <div className="flex-1 min-h-[1px] h-[1px] w-full bg-black/10"></div>
                        </div>

                        <FormField
                            control={form.control}
                            name='link'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-base'>Link</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


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
