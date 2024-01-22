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
import { combineReducers } from '@reduxjs/toolkit'

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
                const formattedAMTimeIn = userLog.AmTimeIn ? formatTime(userLog.AmTimeIn) : '--:--'
                const formattedAMTimeOut = userLog.AmTimeOut ? formatTime(userLog.AmTimeOut) : '--:--'

                const formattedPMTimeIn = userLog.PmTimeIn ? formatTime(userLog.PmTimeIn) : '--:--'
                const formattedPMTimeOut = userLog.PmTimeOut ? formatTime(userLog.PmTimeOut) : '--:--'

                const fullName = `${userLog.user?.firstName} ${userLog.user?.middleName} ${userLog.user?.lastName}`

                return {
                    _id: userLog._id,
                    user: userLog.user._id,
                    date: formatDate(new Date(userLog.date)),
                    name: fullName,
                    AmTimeIn: formattedAMTimeIn,
                    AmTimeOut: formattedAMTimeOut,
                    PmTimeIn: formattedPMTimeIn,
                    PmTimeOut: formattedPMTimeOut,
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
            const isTimeIn = newLogData.isTimeIn

            const formattedDate = formatDate(new Date(newLogData.date))

            const formattedAMTimeIn = newLogData.AmTimeIn ? formatTime(newLogData.AmTimeIn) : '--:--'
            const formattedAMTimeOut = newLogData.AmTimeOut ? formatTime(newLogData.AmTimeOut) : '--:--'

            const formattedPMTimeIn = newLogData.PmTimeIn ? formatTime(newLogData.PmTimeIn) : '--:--'
            const formattedPMTimeOut = newLogData.PmTimeOut ? formatTime(newLogData.PmTimeOut) : '--:--'

            newLogData.date = formattedDate
            newLogData.AmTimeIn = formattedAMTimeIn
            newLogData.AmTimeOut = formattedAMTimeOut
            newLogData.PmTimeIn = formattedPMTimeIn
            newLogData.PmTimeOut = formattedPMTimeOut
            newLogData.totalTimeRendered = newLogData.totalTimeRendered ?? '--:--'
            newLogData.name = newLogData.userName

            newLogData.updatedAt = new Date().toISOString()

            toast.info(`${newLogData.name} timed ${isTimeIn ? 'in' : 'out'}`, {
                position: toast.POSITION.TOP_CENTER,
            })

            setData((prevData) => {
                if (isTimeIn) {
                    console.log(newLogData.AmTimeOut);
                    if (newLogData.AmTimeOut !== '--:--') {
                        const updatedData = prevData.map((log: Log) => {
                            if (log._id === newLogData._id) {
                                return newLogData
                            }
                            return log
                        })
                        return updatedData
                    }else {
                        return [newLogData, ...prevData]
                    }
                } else {
                    const updatedData = prevData.map((log) => {
                        if (log._id === newLogData._id) {
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
                                <Link target='_blank' to='/monitor'>Display Monitor</Link>
                            </Button>,
                            <FormModalBtn
                                btnLabel='Print Attendance'
                                dlgTitle='Print Attendance'
                                formComponent={<AttendancePrintForm userId={null} />}
                            />,
                        ]}></DataTable>
                </CardContent>
            </Card>
        </div>
    )
}

export default Home
