import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'

import { FormModalBtn } from '@/components/global/formModalBtn'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useGetUserQuery } from '@/slices/usersApiSlice'
import { IUserProfile } from '@/types/index'

import { formatDate } from '@/util/formatter'

import UserForm from '../../../util/userform'

export function ProfileCard() {
    const [profile, setProfile] = useState<IUserProfile>()

    const { id } = useParams()

    const { data: user } = useGetUserQuery(id as string)

    useEffect(() => {
        if (user) {
            const data = {
                fullname: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
                email: user.email,
                role: user.role,
                department: user.department ?? 'N/A',
                status: user.status,
                idNumber: user.idNumber ?? 'N/A',
                rfid: user.rfid ?? 'N/A',
                birthdate: user.birthdate ? formatDate(new Date(user.birthdate)) : 'N/A',
                sex: user.sex ?? 'N/A',
                contactNumber: user.contactNumber ?? 'N/A',
                address: user.address ?? 'N/A',
            }
            setProfile(data)
        }
    }, [user])

    return (
        <Card>
            <CardContent className='grid gap-4'>
                <Tabs defaultValue='basicInfo' className='mt-6 w-full'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-4'>
                            <TabsList>
                                <TabsTrigger value='basicInfo'>Basic Info</TabsTrigger>
                                <TabsTrigger value='addtlInfo'>Additional Info</TabsTrigger>
                            </TabsList>
                            {/*  Status here */}
                            {/* Status */}
                            <div className='flex items-center gap-2'>
                                <div
                                    className={`h-4 w-4 rounded-full ${
                                        profile?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                <span
                                    className={`text-sm font-medium ${
                                        profile?.status === 'active'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }`}>
                                    {profile?.status}
                                </span>
                            </div>
                        </div>
                        <FormModalBtn
                            btnLabel='Edit User Details'
                            dlgTitle='Edit User Details'
                            formComponent={<UserForm isEdit={true} />}
                        />
                    </div>

                    <TabsContent value='basicInfo'>
                        <div className='grid grid-cols-3 gap-6 mt-5'>
                            <div>
                                <Label htmlFor='name'>Name</Label>
                                <Input
                                    id='name'
                                    type='text'
                                    defaultValue={profile?.fullname}
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    defaultValue={profile?.email}
                                    readOnly
                                />
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
                                        defaultValue={profile?.contactNumber}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value='addtlInfo'>
                        <div className='grid grid-cols-2 gap-6 mt-5'>
                            <div>
                                <Label htmlFor='role'>Role</Label>
                                <Input
                                    id='role'
                                    type='text'
                                    defaultValue={profile?.role}
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label htmlFor='department'>Department</Label>
                                <Input
                                    id='department'
                                    type='text'
                                    defaultValue={profile?.department}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6 mt-3'>
                            <div>
                                <Label htmlFor='idNumber'>ID Number</Label>
                                <Input
                                    id='idNumber'
                                    type='text'
                                    defaultValue={profile?.idNumber}
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label htmlFor='rfid'>RFID</Label>
                                <Input
                                    id='rfid'
                                    type='text'
                                    defaultValue={profile?.rfid}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6 mt-3'>
                            <div>
                                <Label htmlFor='birtdate'>Birthdate</Label>
                                <Input
                                    id='birtdate'
                                    type='text'
                                    defaultValue={profile?.birthdate}
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label htmlFor='sex'>Gender</Label>
                                <Input id='sex' type='text' defaultValue={profile?.sex} readOnly />
                            </div>
                        </div>
                        <div className='gap-6 mt-3'>
                            <Label htmlFor='address'>Address</Label>
                            <Input
                                id='address'
                                type='text'
                                defaultValue={profile?.address}
                                readOnly
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className='grid gap-2'></div>
            </CardContent>
        </Card>
    )
}
