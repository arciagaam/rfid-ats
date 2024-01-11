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
import { API_BASE_URL } from '@/constants/constants'
import { FormModalBtn } from '@/components/global/formModalBtn'
import AttendancePrintForm from '@/util/attendanceprintform'

const Home = () => {
    const [data, setData] = useState<Log[]>([])

    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { data: userLogs, refetch } = useGetUserLogsByIDQuery(userInfo!._id as string)

    useEffect(() => {
        if (userLogs) {
            const tableData = userLogs.map((userLog: Log) => {
                const formattedAMTimeIn = userLog.AmTimeIn ? formatTime(userLog.AmTimeIn) : '--:--'
                const formattedAMTimeOut = userLog.AmTimeOut ? formatTime(userLog.AmTimeOut) : '--:--'

                const formattedPMTimeIn = userLog.PmTimeIn ? formatTime(userLog.PmTimeIn) : '--:--'
                const formattedPMTimeOut = userLog.PmTimeOut ? formatTime(userLog.PmTimeOut) : '--:--'

                return {
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
            const isTimeIn = (newLogData.AmTimeOut === null && newLogData.PmTimeOut === null)

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

            if (newLogData.user === userInfo!._id) {
                setData((prevData) => {
                    if (isTimeIn) {
                        return [newLogData, ...prevData]
                    } else {
                        const updatedData = prevData.map((log) => {
                            if (
                                log.date === formattedDate &&
                                (log.AmTimeOut === '--:--' || log.PmTimeOut === '--:--')
                            ) {
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
                            searchPlaceholder='Search date eg. yyyy-mm-dd'
                            component={
                                <FormModalBtn
                                    btnLabel='Print Attendance'
                                    dlgTitle='Print Attendance'
                                    formComponent={<AttendancePrintForm userId={userInfo!._id} />}
                                />
                            }>

                        </DataTable>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Home
