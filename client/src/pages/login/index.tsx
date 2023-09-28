import React from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Checkbox } from '@/components/ui/checkbox'
import { loginSchema } from '@/validators/auth'

const Login = () => {

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    console.log(data)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-10">
      <div className="flex flex-col items-center w-1/2 gap-10 p-10 border rounded-lg">

        <div className="flex items-center gap-5">
          <div className="h-20 bg-blue-500 rounded-full min-h-1 aspect-square"></div>
          <h1>College Of Industrial Technology</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-3">

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 mt-3">
              <Checkbox id="remember_me" name='remember_me' />
              <Label htmlFor="remember_me">Remember Me</Label>
            </div>

            <Button type="submit">Login</Button>

          </form>
        </Form>
      </div>

    </div >
  )
}

export default Login