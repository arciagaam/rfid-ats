// import { Label } from '@/components/ui/label'

// import { DataTable } from '../../../components/global/dataTable'
// import { Log, IUserRow, columns } from './columns'
// import { useEffect, useState } from 'react'

import { DataTable } from '../../../components/global/dataTable'
import { Log, columns, IUserRow } from './columns'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

import { useGetUsersQuery } from '@/slices/usersApiSlice'

const Users = () => {
    const [data, setData] = useState<Log[]>([])

    const { data: users, refetch } = useGetUsersQuery(null)

    useEffect(() => {
        if (users) {
            const tableData = users.map((user: IUserRow) => ({
                id: user._id,
                name: `${user.firstName} ${user.middleName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                status: user.status,
            }))
            setData(tableData)
        }
        refetch()
    }, [users, refetch])

    return (
        <div className='flex flex-col gap-10 text-[#1e1e1e]'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Users</h1>
            </div>
            <DataTable
                columns={columns}
                data={data}
                component={[
                    <Button asChild>
                        <Link to='register'>Add User</Link>
                    </Button>,
                ]}
            />
        </div>
    )
}

export default Users
