import { useState, useEffect } from 'react'

import { DataTable } from '@/components/global/datatable/dataTable'
import { Log } from './columns'
import { columns } from './columns'
import io from 'socket.io-client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useGetUsersLogsQuery, useGetUsersQuery } from '@/slices/usersApiSlice'

import { formatDate, formatTime } from '@/util/formatter'
import AttendancePrintForm from '@/util/attendanceprintform'
import { FormModalBtn } from '@/components/global/formModalBtn'
import {
    useGetAccomplishmentReportsQuery,
    useGetPendingARQuery,
} from '@/slices/accomplishmentReportApiSlice'
import { API_BASE_URL } from '@/constants/constants'

import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState<Log[]>([])
    const [cardData, setCardData] = useState({
        userCount: 0,
        arsCount: 0,
        pendingArsCount: 0,
    })

    const { data: userLogs, refetch: logsRefetch } = useGetUsersLogsQuery(null)
    const { data: users, refetch: usersRefetch } = useGetUsersQuery('')
    const { data: ars, refetch: arRefetch } = useGetAccomplishmentReportsQuery('')
    const { data: pendingArs, refetch: pendingArsRefetch } = useGetPendingARQuery('')

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
        logsRefetch()
    }, [userLogs, logsRefetch])

    useEffect(() => {
        pendingArsRefetch()
        arRefetch()
        usersRefetch()

        if (users) {
            setCardData((prev) => ({ ...prev, userCount: users.length }))
        }

        if (ars) {
            setCardData((prev) => ({ ...prev, arsCount: ars.length }))
        }

        if (pendingArs) {
            setCardData((prev) => ({
                ...prev,
                pendingArsCount: pendingArs.length,
            }))
        }
    }, [users, ars, pendingArs, usersRefetch, arRefetch, pendingArsRefetch])

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
            newLogData.name = newLogData.userName

            newLogData.updatedAt = new Date().toISOString()

            toast.info(`${newLogData.name} tapped ${isTimeIn ? 'in' : 'out'}`, {
                position: toast.POSITION.TOP_CENTER,
            })

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
                        <p>{cardData.userCount}</p>
                    </CardContent>
                </Card>

                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Pending AR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{cardData.pendingArsCount}</p>
                    </CardContent>
                </Card>

                <Card className='flex-1'>
                    <CardHeader>
                        <CardTitle>Accomplished AR</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{cardData.arsCount}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <p className='font-bold text-lg'>Realtime Attendance Monitoring</p>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        initialPageSize={5}
                        data={data}
                        columnSearch='date'
                        searchPlaceholder='Search date eg. yyyy-mm-dd...'
                        component={[
                            <Button asChild>
                                <Link to='/monitor'>Display Monitor</Link>
                            </Button>,
                            <FormModalBtn
                                btnLabel='Print Attendance'
                                dlgTitle='Print Attendance'
                                formComponent={<AttendancePrintForm />}
                            />,
                        ]}></DataTable>
                </CardContent>
            </Card>
        </div>
    )
}

export default Home
