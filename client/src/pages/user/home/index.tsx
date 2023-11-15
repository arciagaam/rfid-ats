import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

import { Card, CardContent } from '@/components/ui/card'
import { ProfileCard } from './profilecard'

import { DataTable } from '@/components/global/datatable/dataTable'
import { Log, columns } from './columns'
import io from 'socket.io-client'

import { useGetUserLogsByIDQuery } from '@/slices/usersApiSlice'

import { formatDate, formatTime } from '@/util/formatter'

const Home = () => {
    const [data, setData] = useState<Log[]>([])

    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { data: userLogs, refetch } = useGetUserLogsByIDQuery(userInfo!._id as string)

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

            newLogData.updatedAt = new Date().toISOString()

            if (newLogData.user === userInfo!._id) {
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
    }, [userInfo])

    return (
        <>
            <div className='flex flex-col gap-5'>
                <h1 className='text-lg font-bold'>Welcome, {`${userInfo?.firstName}`}</h1>
                <ProfileCard />
                <Card>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            initialPageSize={5}
                            data={data}
                            columnSearch='date'
                            searchPlaceholder='Search date eg. mm-dd-yyyy'></DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Home
