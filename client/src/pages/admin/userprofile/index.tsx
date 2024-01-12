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
import { FormModalBtn } from '@/components/global/formModalBtn'
import AttendancePrintForm from '@/util/attendanceprintform'

const ShowUser = () => {
    const { id: userId } = useParams()

    const [data, setData] = useState<Log[]>([])

    const navigate = useNavigate()

    const { data: userLogs, refetch } = useGetUserLogsByIDQuery(userId as string)

    useEffect(() => {
        if (userLogs) {
            const tableData = userLogs.map((userLog: Log) => {
                const formattedAMTimeIn = userLog.AmTimeIn ? formatTime(userLog.AmTimeIn) : '--:--'
                const formattedAMTimeOut = userLog.AmTimeOut ? formatTime(userLog.AmTimeOut) : '--:--'

                const formattedPMTimeIn = userLog.PmTimeIn ? formatTime(userLog.PmTimeIn) : '--:--'
                const formattedPMTimeOut = userLog.PmTimeOut ? formatTime(userLog.PmTimeOut) : '--:--'

                return {
                    _id: userLog._id,
                    date: formatDate(new Date(userLog.date)),
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
        refetch()
    }, [userLogs, refetch])

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

            newLogData.updatedAt = new Date().toISOString()

            if (newLogData.user === userId) {
                setData((prevData) => {
                    if (isTimeIn) {
                        if (newLogData.AmTimeIn !== null && newLogData.AmTimeOut !== null) {
                            const updatedData = prevData.map((log: Log) => {
                                if (log._id === newLogData._id) {
                                    return newLogData
                                }
                                return log
                            })
                            return updatedData
                        }

                        return [newLogData, ...prevData]
                    } else {
                        const updatedData = prevData.map((log: Log) => {
                            if (log._id === newLogData._id) {
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
                            searchPlaceholder='Search date eg. yyyy-mm-dd...'
                            component={
                                <FormModalBtn
                                    btnLabel='Print Attendance'
                                    dlgTitle='Print Attendance'
                                    formComponent={<AttendancePrintForm userId={userId} />}
                                />
                            }

                        ></DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ShowUser
