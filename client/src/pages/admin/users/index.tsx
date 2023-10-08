// import { Label } from '@/components/ui/label'

import { DataTable } from '../../../components/global/dataTable'
import { Log, IUserRow, columns } from './columns'
import { useEffect, useState } from 'react'

import { DataTable } from '../../../components/global/dataTable'
import { Log, columns } from './columns'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Users = () => {
    const [data, setData] = useState<Log[]>([])

    const { data: users } = useGetUsersQuery(null)

    useEffect(() => {
        async function getData() {
            // test lang lipat to pag okay na
            const data = await fetch('http://127.0.0.1:3001/api/users')

            if (data.ok) {
                const users = await data.json()
                console.log(users)
                setData(users)
            }
            // Fetch data from your API here.
        }

        getData()
    }, [])

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Users</h1>
                <Button asChild>
                    <Link to='register'>Add User</Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default Users
