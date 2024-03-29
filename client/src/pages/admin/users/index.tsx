// import { Label } from '@/components/ui/label'

// import { DataTable } from '../../../components/global/dataTable'
// import { Log, IUserRow, columns } from './columns'
// import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { DataTable } from '../../../components/global/datatable/dataTable'
import { Log, columns, IUserRow } from './columns'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

import { useGetUsersQuery } from '@/slices/usersApiSlice'
import { Card, CardContent } from '@/components/ui/card'
import { FormModalBtn } from '@/components/global/formModalBtn'
import UserForm from '../../../util/userform'
import { API_BASE_URL } from '@/constants/constants'

const Users = () => {
    const [data, setData] = useState<Log[]>([])

    const { data: users, refetch } = useGetUsersQuery('')

    useEffect(() => {
        if (users) {
            const tableData = users.map((user: IUserRow) => ({
                id: user._id,
                name: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
                email: user.email,
                role: user.role,
                status: user.status,
            }))
            setData(tableData)
        }
        refetch()
    }, [users, refetch])

    useEffect(() => {
        const socket = io(API_BASE_URL)
        socket.on('new_user', (content) => {
            refetch()
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Users</h1>
            </div>
            <Card>
                <CardContent>
                    <DataTable
                        key={users?.length}
                        columns={columns}
                        data={data}
                        searchPlaceholder='Search name...'
                        component={[
                            <FormModalBtn
                                btnLabel='Add User'
                                dlgTitle='Add User'
                                formComponent={<UserForm />}
                            />,

                            <Button asChild>
                                <Link to='rfid'>Manage RFID</Link>
                            </Button>,
                        ]}
                        columnSearch='name'
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default Users
