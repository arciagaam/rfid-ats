import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    // CardHeader,
    // CardTitle,
} from '@/components/ui/card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useGetUserQuery } from '@/slices/usersApiSlice'
import { IUserProfile } from '@/types/index'

export function ProfileCard() {
    const [profile, setProfile] = useState<IUserProfile>()

    const { id } = useParams()

    const { data: user } = useGetUserQuery(id)
    console.log(user)

    useEffect(() => {
        if (user) {
            const data = {
                fullname: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
                email: user.email,
                role: user.role,
                department: user.department,
                status: user.status,
                idNumber: user.idNumber ?? 'N/A',
                rfid: user.rfid ?? 'N/A',
                birthdate: formatDate(new Date(user.birthdate)),
                sex: user.sex,
                contactNumber: user.contactNumber,
                address: user.address,
            }
            setProfile(data)
        }
    }, [user])

    function formatDate(date = new Date()) {
        const year = date.toLocaleString('default', { year: 'numeric' })
        const month = date.toLocaleString('default', {
            month: '2-digit',
        })
        const day = date.toLocaleString('default', { day: '2-digit' })

        return [year, month, day].join('-')
    }

    return (
        <Card>
            <CardContent className='grid gap-4'>
                {/* <div className='grid grid-cols-2 gap-6'>
                    <Button variant='outline'>Github</Button>
                    <Button variant='outline'>Google</Button>
                </div>
                <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t' />
                    </div>
                    <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-background px-2 text-muted-foreground'>
                            Or continue with
                        </span>
                    </div>
                </div> */}
                <Tabs defaultValue='basicInfo' className='mt-6 w-full'>
                    <div className='flex justify-between'>
                        <TabsList>
                            <TabsTrigger value='basicInfo'>Basic Info</TabsTrigger>
                            <TabsTrigger value='addtlInfo'>Additional Info</TabsTrigger>
                        </TabsList>
                        <Button>Edit User Details</Button>
                    </div>

                    <TabsContent value='basicInfo'>
                        <div className='grid grid-cols-3 gap-6 mt-5'>
                            <div>
                                <Label htmlFor='name'>Name</Label>
                                <Input id='name' type='text' value={profile?.fullname} />
                            </div>
                            <div>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' type='email' value={profile?.email} />
                            </div>
                            <div>
                                <Label htmlFor='contactNumber'>Contact Number</Label>
                                <div className='flex items-center bg-white rounded-md focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2'>
                                    <div className='text-[#1e1e1e80] flex items-center justify-center text-sm rounded-l-md pl-3 border border-input ring-offset-background h-10 border-r-0 py-2'>
                                        +63
                                    </div>
                                    <Input
                                        id='contactNumber'
                                        className='border-l-0 rounded-l-none w-full focus-visible:ring-0 focus-visible:ring-offset-0'
                                        type='text'
                                        value={profile?.contactNumber}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value='addtlInfo'>
                        <div className='grid grid-cols-2 gap-6 mt-5'>
                            <div>
                                <Label htmlFor='role'>Role</Label>
                                <Input id='role' type='text' value={profile?.role} />
                            </div>
                            <div>
                                <Label htmlFor='department'>Department</Label>
                                <Input id='department' type='text' value={profile?.department} />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6 mt-3'>
                            <div>
                                <Label htmlFor='idNumber'>ID Number</Label>
                                <Input id='idNumber' type='text' value={profile?.idNumber} />
                            </div>
                            <div>
                                <Label htmlFor='rfid'>RFID</Label>
                                <Input id='rfid' type='text' value={profile?.rfid} />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6 mt-3'>
                            <div>
                                <Label htmlFor='birtdate'>Birthdate</Label>
                                <Input id='birtdate' type='text' value={profile?.birthdate} />
                            </div>
                            <div>
                                <Label htmlFor='sex'>Gender</Label>
                                <Input id='sex' type='text' value={profile?.sex} />
                            </div>
                        </div>
                        <div className='gap-6 mt-3'>
                            <Label htmlFor='address'>Address</Label>
                            <Input id='address' type='text' value={profile?.address} />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className='grid gap-2'></div>
            </CardContent>
        </Card>
    )
}
