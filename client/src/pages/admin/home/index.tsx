import { useState, useEffect } from 'react'

import { DataTable } from '@/components/global/datatable/dataTable'
import { Log } from './columns'
import { columns } from './columns'
import io from 'socket.io-client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetUsersLogsQuery } from '@/slices/usersApiSlice'

import { formatDate, formatTime } from '@/util/formatter'

const Home = () => {
    const [data, setData] = useState<Log[]>([])

    const { data: userLogs, refetch } = useGetUsersLogsQuery(null)

    useEffect(() => {
        if (userLogs) {
            const tableData = userLogs.map((userLog: Log) => {
                const formattedTimeIn = formatTime(userLog.timeIn)
                const formattedTimeOut = userLog.timeOut ? formatTime(userLog.timeOut) : '--:--'

                const fullName = `${userLog.user?.firstName} ${userLog.user?.middleName} ${userLog.user?.lastName}`

                return {
                    date: formatDate(new Date(userLog.date)),
                    name: fullName,
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
        const socket = io('http://127.0.0.1:3001')

        socket.on('newLog', (newLogData) => {
            const isTimeIn = newLogData.timeOut === null

            const formattedDate = formatDate(new Date(newLogData.date))
            const formattedTimeIn = formatTime(newLogData.timeIn)
            const formattedTimeOut = newLogData.timeOut ? formatTime(newLogData.timeOut) : '--:--'

            newLogData.date = formattedDate
            newLogData.timeIn = formattedTimeIn
            newLogData.timeOut = formattedTimeOut
            newLogData.totalTimeRendered = newLogData.totalTimeRendered ?? '--:--'
            newLogData.name = newLogData.userName

            newLogData.updatedAt = new Date().toISOString()

            console.log(newLogData)

            setData((prevData) => {
                if (isTimeIn) {
                    return [newLogData, ...prevData]
                } else {
                    const updatedData = prevData.map((log) => {
                        if (
                            log.user === newLogData.user &&
                            log.date === formattedDate &&
                            log.timeOut === '--:--'
                        ) {
                            return newLogData
                        }
                        return log
                    })

                    return updatedData
                }
            })
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex gap-5'>
                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Number of Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                </Card>

                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Pending AR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                </Card>

                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Accomplished AR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                </Card>
            </div>

            <Card className='bg-primary-blue-50/20 border-0 shadow-md'>
                <CardHeader>
                    <p className='font-bold text-lg'>Realtime Attendance Monitoring</p>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        initialPageSize={5}
                        data={data}
                        columnSearch='date'></DataTable>
                </CardContent>
            </Card>
        </div>
    )
}

export default Home
