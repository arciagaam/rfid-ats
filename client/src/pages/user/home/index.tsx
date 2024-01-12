import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProfileCard } from './profilecard'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { DataTable } from '@/components/global/datatable/dataTable'
import { Log, columns } from './columns'
import io from 'socket.io-client'

import { useGetUserLogsByIDQuery, useGetProfileQuery } from '@/slices/usersApiSlice'

import { formatTime } from '@/util/formatter'
import moment from 'moment'

import { API_BASE_URL } from '@/constants/constants'
import { FormModalBtn } from '@/components/global/formModalBtn'
import { RiFileWarningFill } from 'react-icons/ri'
import AttendancePrintForm from '@/util/attendanceprintform'

const Home = () => {
    const [data, setData] = useState<Log[]>([])
    const [open, setOpen] = useState(false)

    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { data: user } = useGetProfileQuery(userInfo!._id as string)
    const { data: userLogs, refetch } = useGetUserLogsByIDQuery(userInfo!._id as string)

    // format date to readable format eg. 2021-09-01T16:00:00.000Z -> September 1, 2021
    const formatDate = (date) => moment(date).format('MMMM D, YYYY')
    const dueDate = formatDate(new Date(userInfo!.isPendingAR?.deadline))

    useEffect(() => {
        if (user && user.isPendingAR.status) {
            setOpen(true)
        }
    }, [user])

    useEffect(() => {
        if (userLogs) {
            const tableData = userLogs.map((userLog: Log) => {
                const formattedAMTimeIn = userLog.AmTimeIn ? formatTime(userLog.AmTimeIn) : '--:--'
                const formattedAMTimeOut = userLog.AmTimeOut ? formatTime(userLog.AmTimeOut) : '--:--'

                const formattedPMTimeIn = userLog.PmTimeIn ? formatTime(userLog.PmTimeIn) : '--:--'
                const formattedPMTimeOut = userLog.PmTimeOut ? formatTime(userLog.PmTimeOut) : '--:--'

                return {
                    _id: userLog._id,
                    user: userLog.user,
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

            if (newLogData.user === userInfo!._id) {
                setData((prevData) => {
                    if (isTimeIn) {
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
                            }></DataTable>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex space-x-2'>
                            <RiFileWarningFill size={20} className='text-[#ff0000]' />
                            <span>Pending Accomplishment Report</span>
                        </DialogTitle>
                        <DialogDescription className='pt-5'>
                            {`Please submit your pending accomplishment reports by ${dueDate}.
                            `}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button className='btn btn-primary'>Proceed</Button>
                        </DialogTrigger>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Home
