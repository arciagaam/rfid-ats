// import { Label } from '@/components/ui/label'

import { DataTable } from '../../../components/global/dataTable'
import { Log, IUserRow, columns } from './columns'
import { useEffect, useState } from 'react'

import { useGetUsersQuery } from '@/slices/usersApiSlice'

const Users = () => {
    const [data, setData] = useState<Log[]>([])

    const { data: users } = useGetUsersQuery(null)
    console.log(users)

    useEffect(() => {
        if (users) {
            const simplifiedData = users.map((user: IUserRow) => ({
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                status: user.status,
            }))
            setData(simplifiedData)
        }
    }, [users])

    return (
        <div className='flex flex-col gap-10'>
            <h1 className='text-xl font-bold'>Users</h1>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default Users
