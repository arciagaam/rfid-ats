import { useGetUserQuery } from '@/slices/usersApiSlice'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { Log } from '../users/columns'
import { cn } from '@/lib/utils'

import { DataTable } from '@/components/global/dataTable'

import { IUserProfile } from '@/types/index'
import { columns } from './columns'
import { Card, CardContent } from '@/components/ui/card'
import { ProfileCard } from './profilecard'

function DemoContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex items-center justify-center [&>div]:w-full', className)}
            {...props}
        />
    )
}

const ShowUser = () => {
    const [profile, setProfile] = useState<IUserProfile>()

    const [data, setData] = useState<Log[]>([])

    const { id } = useParams()
    const { data: user } = useGetUserQuery(id)
    const navigate = useNavigate()

    function formatDate(date = new Date()) {
        const year = date.toLocaleString('default', { year: 'numeric' })
        const month = date.toLocaleString('default', {
            month: '2-digit',
        })
        const day = date.toLocaleString('default', { day: '2-digit' })

        return [year, month, day].join('-')
    }

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

    return (
        <>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                    <button
                        className='flex gap-2 items-center hover:underline '
                        onClick={() => {
                            navigate('/admin/users')
                        }}>
                        <BiArrowBack />
                        Back to Users
                    </button>
                    <h1 className='text-lg font-bold'>User Profile</h1>
                </div>
                <DemoContainer>
                    <ProfileCard />
                </DemoContainer>
                <Card>
                    <CardContent>
                        <DataTable columns={columns} data={data}></DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ShowUser
