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
import { registerSchema } from '@/validators/auth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const Register = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log(data);
    const { email } = data;

    console.log(email)
  }


  return (
    <div className="flex flex-col gap-10">
      <h1 className='text-xl font-bold'>Register User</h1>

      <div className="flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-5'>

            <div className="grid grid-cols-3 w-full gap-5">
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter first name' {...field} />
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
                      <Input placeholder='Enter middle name' {...field} />
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
                      <Input placeholder='Enter last name' {...field} />
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

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Role</FormLabel>
                    <Select onValueChange={(value) => { field.onChange; setSelectedRole(value) }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {
              selectedRole == 'faculty' ?
                <div className="grid grid-cols-3 gap-5 w-full">

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
                        <FormLabel className='text-base'>RFID <span className='text-slate-400 text-xs ml-1'>Optional</span></FormLabel>
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
                    name='birthday'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-base'>Birthday</FormLabel>
                        <FormControl>
                          <Input type='date' placeholder='Enter birthday' {...field} />
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
                        <Select {...field}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
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
                        <FormLabel className='text-base'>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter Contact Number' {...field} />
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
                : null
            }


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