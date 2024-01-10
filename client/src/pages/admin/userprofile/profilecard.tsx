import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'

import { FormModalBtn } from '@/components/global/formModalBtn'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useGetUserQuery } from '@/slices/usersApiSlice'
import { IUserProfile } from '@/types/index'

import { formatDate } from '@/util/formatter'

import UserForm from '../../../util/userform'

import ClipLoader from 'react-spinners/ClipLoader'

import { API_BASE_URL } from '@/constants/constants'

export function ProfileCard() {
    const [profile, setProfile] = useState<IUserProfile>()

    const { id } = useParams()

    const { data: user, refetch } = useGetUserQuery(id as string)

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
                profilePicture: user.profilePicture ?? null,
            }
            refetch()
            setProfile(data)
        }
    }, [user, refetch])

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
                            {profile ? (
                                <div className='flex items-center gap-2'>
                                    <div
                                        className={`h-4 w-4 rounded-full ${
                                            profile?.status === 'active'
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
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
                            ) : (
                                <ClipLoader size={20} color='#3657ff' />
                            )}
                        </div>
                        <FormModalBtn
                            btnLabel='Edit User Details'
                            dlgTitle='Edit User Details'
                            formComponent={<UserForm isEdit={true} />}
                        />
                    </div>

                    <TabsContent value='basicInfo'>
                        <div className='flex gap-3 mt-10'>
                            <div className='col-span-3 flex w-1/4'>
                                <div className='aspect-square h-48 overflow-clip'>
                                    {profile?.profilePicture ? (
                                        <img
                                            className='h-full object-cover rounded-lg'
                                            alt='profile picture'
                                            src={`${API_BASE_URL}/images/${profile?.profilePicture}`}></img>
                                    ) : (
                                        'No Image'
                                    )}
                                </div>
                            </div>
                            <div className='grid grid-cols-3 gap-6 mt-5 w-full'>
                                <div>
                                    <Label htmlFor='name'>Name</Label>
                                    {profile ? (
                                        <Input
                                            id='name'
                                            type='text'
                                            value={profile?.fullname}
                                            readOnly
                                        />
                                    ) : (
                                        <Skeleton className='h-10' />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor='email'>Email</Label>
                                    {profile ? (
                                        <Input
                                            id='email'
                                            type='email'
                                            value={profile?.email}
                                            readOnly
                                        />
                                    ) : (
                                        <Skeleton className='h-10' />
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor='contactNumber'>Contact Number</Label>
                                    {profile ? (
                                        <div className='flex items-center bg-white rounded-md focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2'>
                                            <div className='text-[#1e1e1e80] flex items-center justify-center text-sm rounded-l-md pl-3 border border-input ring-offset-background h-10 border-r-0 py-2'>
                                                +63
                                            </div>
                                            <Input
                                                id='contactNumber'
                                                className='border-l-0 rounded-l-none w-full focus-visible:ring-0 focus-visible:ring-offset-0'
                                                type='text'
                                                value={profile?.contactNumber}
                                                readOnly
                                            />
                                        </div>
                                    ) : (
                                        <Skeleton className='h-10' />
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value='addtlInfo'>
                        <div className='grid grid-cols-2 gap-6 mt-5'>
                            <div>
                                <Label htmlFor='role'>Role</Label>
                                {profile ? (
                                    <Input id='role' type='text' value={profile?.role} readOnly />
                                ) : (
                                    <Skeleton className='h-10' />
                                )}
                            </div>
                            <div>
                                <Label htmlFor='department'>Department</Label>
                                {profile ? (
                                    <Input
                                        id='department'
                                        type='text'
                                        value={profile?.department}
                                        readOnly
                                    />
                                ) : (
                                    <Skeleton className='h-10' />
                                )}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6 mt-3'>
                            <div>
                                <Label htmlFor='idNumber'>ID Number</Label>
                                {profile ? (
                                    <Input
                                        id='idNumber'
                                        type='text'
                                        value={profile?.idNumber}
                                        readOnly
                                    />
                                ) : (
                                    <Skeleton className='h-10' />
                                )}
                            </div>
                            <div>
                                <Label htmlFor='rfid'>RFID</Label>
                                {profile ? (
                                    <Input id='rfid' type='text' value={profile?.rfid} readOnly />
                                ) : (
                                    <Skeleton className='h-10' />
                                )}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-6 mt-3'>
                            <div>
                                <Label htmlFor='birtdate'>Birthdate</Label>
                                {profile ? (
                                    <Input
                                        id='birtdate'
                                        type='text'
                                        value={profile?.birthdate}
                                        readOnly
                                    />
                                ) : (
                                    <Skeleton className='h-10' />
                                )}
                            </div>
                            <div>
                                <Label htmlFor='sex'>Gender</Label>
                                {profile ? (
                                    <Input id='sex' type='text' value={profile?.sex} readOnly />
                                ) : (
                                    <Skeleton className='h-10' />
                                )}
                            </div>
                        </div>
                        <div className='gap-6 mt-3'>
                            <Label htmlFor='address'>Address</Label>
                            {profile ? (
                                <Input id='address' type='text' value={profile?.address} readOnly />
                            ) : (
                                <Skeleton className='h-10' />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className='grid gap-2'></div>
            </CardContent>
        </Card>
    )
}
