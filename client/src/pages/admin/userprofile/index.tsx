import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { Log } from '../userprofile/columns'

import { DataTable } from '@/components/global/dataTable'
import { columns } from './columns'

import { Card, CardContent } from '@/components/ui/card'
import { ProfileCard } from './profilecard'

import { useGetUserLogsQuery } from '@/slices/usersApiSlice'
import io from 'socket.io-client'

import { formatDate, formatTime } from '@/util/formatter'

const ShowUser = () => {
    const { id: userId } = useParams()

    const [data, setData] = useState<Log[]>([])

    const navigate = useNavigate()

    const { data: userLogs, refetch } = useGetUserLogsQuery(userId as string)

    useEffect(() => {
        if (userLogs) {
            const tableData = userLogs.map((userLog: Log) => {
                const formattedTimeIn = formatTime(userLog.timeIn)
                const formattedTimeOut = userLog.timeOut ? formatTime(userLog.timeOut) : 'N/A'

                return {
                    date: formatDate(new Date(userLog.date)),
                    timeIn: formattedTimeIn,
                    timeOut: formattedTimeOut,
                    hoursWorked: userLog.hoursWorked,
                }
            })

            setData(tableData)
        }
        refetch()
    }, [userLogs, refetch])

    useEffect(() => {
        const socket = io('http://localhost:3001')

        socket.on('newLog', (newLogData) => {
            console.log('Received new log data:', newLogData)
            setData((prevData) => [newLogData, ...prevData])
        })

        return () => {
            socket.disconnect()
        }
    }, [])

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
                <ProfileCard />
                <Card>
                    <CardContent>
                        <DataTable columns={columns} data={data} columnSearch='date'></DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ShowUser
