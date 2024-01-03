import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { Log } from '../userprofile/columns'

import { DataTable } from '@/components/global/datatable/dataTable'
import { columns } from './columns'

import { Card, CardContent } from '@/components/ui/card'
import { ProfileCard } from './profilecard'

import { useGetUserLogsByIDQuery } from '@/slices/usersApiSlice'
import io from 'socket.io-client'

import { formatDate, formatTime } from '@/util/formatter'
import { API_BASE_URL } from '@/constants/constants'

const ShowUser = () => {
    const { id: userId } = useParams()

    const [data, setData] = useState<Log[]>([])

    const navigate = useNavigate()

    const { data: userLogs, refetch } = useGetUserLogsByIDQuery(userId as string)

    useEffect(() => {
        if (userLogs) {
            const tableData = userLogs.map((userLog: Log) => {
                const formattedTimeIn = formatTime(userLog.timeIn)
                const formattedTimeOut = userLog.timeOut ? formatTime(userLog.timeOut) : '--:--'

                return {
                    date: formatDate(new Date(userLog.date)),
                    timeIn: formattedTimeIn,
                    timeOut: formattedTimeOut,
                    totalTimeRendered: userLog.totalTimeRendered
                        ? userLog.totalTimeRendered
                        : '--:--',
                    updatedAt: new Date().toISOString(),
                }
            })

            setData(tableData)
        }
        refetch()
    }, [userLogs, refetch])

    useEffect(() => {
        const socket = io(API_BASE_URL)

        socket.on('newLog', (newLogData) => {
            const isTimeIn = newLogData.timeOut === null

            const formattedDate = formatDate(new Date(newLogData.date))
            const formattedTimeIn = formatTime(newLogData.timeIn)
            const formattedTimeOut = newLogData.timeOut ? formatTime(newLogData.timeOut) : '--:--'

            newLogData.date = formattedDate
            newLogData.timeIn = formattedTimeIn
            newLogData.timeOut = formattedTimeOut
            newLogData.totalTimeRendered = newLogData.totalTimeRendered ?? '--:--'

            newLogData.updatedAt = new Date().toISOString()

            if (newLogData.user === userId) {
                setData((prevData) => {
                    if (isTimeIn) {
                        return [newLogData, ...prevData]
                    } else {
                        const updatedData = prevData.map((log) => {
                            if (log.date === formattedDate && log.timeOut === '--:--') {
                                return newLogData
                            }
                            return log
                        })
                        return updatedData
                    }
                })
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [userId])

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
                        <DataTable
                            columns={columns}
                            initialPageSize={5}
                            data={data}
                            columnSearch='date'
                            searchPlaceholder='Search date eg. yyyy-mm-dd...'></DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ShowUser
