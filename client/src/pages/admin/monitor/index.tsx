import React, { useEffect, useState } from 'react'
import ccslogo from './../../../assets/images/ccs.jpg'
import coelogo from './../../../assets/images/coe.jpg'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '@/constants/constants'
import { formatDate, formatTime } from '@/util/formatter'

interface IdleScreenProps {
    department: string
}

interface ActiveScreenProps {
    data: {
        timeIn: string
        timeOut: string
        name: string
        idNumber: string
        totalTimeRendered: string
        profilePicture: string
    }
}

const Monitor = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { role, department } = userInfo
    const [data, setData] = useState(null)

    let bgColor

    if (department === 'ccs') {
        bgColor = 'bg-primary-blue-500/20'
    } else {
        bgColor = 'bg-yellow-300'
    }

    let timeout

    useEffect(() => {
        const socket = io(API_BASE_URL)

        socket.on('newLog', (newLogData) => {
            clearTimeout(timeout)
            console.log(newLogData)
            const formattedDate = formatDate(new Date(newLogData.date))
            const formattedTimeIn = formatTime(newLogData.timeIn)
            const formattedTimeOut = newLogData.timeOut ? formatTime(newLogData.timeOut) : '--:--'

            newLogData.date = formattedDate
            newLogData.timeIn = formattedTimeIn
            newLogData.timeOut = formattedTimeOut
            newLogData.totalTimeRendered = newLogData.totalTimeRendered ?? '--:--'
            newLogData.name = newLogData.userName
            newLogData.updatedAt = new Date().toISOString()

            setData(newLogData)
            startTimeout(timeout)
        })

        return () => {
            socket.disconnect()
            clearTimeout(timeout)
        }
    }, [])

    const startTimeout = (timeout) => {
        timeout = setTimeout(() => {
            setData(null)
        }, 5000)
    }

    return (
        <div className='flex flex-col h-screen w-full'>
            <div className={`flex w-full justify-center gap-20 ${bgColor} py-5 h-[25vh]`}>
                <div className='aspect-square rounded-full overflow-clip'>
                    {department == 'ccs' ? (
                        <img src={ccslogo} alt='' className='object-cover h-full' />
                    ) : (
                        <img src={coelogo} alt='' className='object-cover h-full' />
                    )}
                </div>

                <div className='flex flex-col'>
                    <h2 className='font-bold text-xl md:text-2xl lg:text-4xl 2xl:text-7xl'>
                        LAGUNA STATE POLYTECHNIC UNIVERSITY
                    </h2>
                    <p className='text-lg md:text-xl lg:text-xl 2xl:text-4xl'>
                        {department == 'ccs'
                            ? 'College of Computer Studies'
                            : 'College of Engineering'}
                    </p>

                    <Time />
                </div>
            </div>

            <div className='relative flex w-full items-center justify-center h-[75vh]'>
                {!data ? <IdleScreen department={department} /> : <ActiveScreen data={data} />}
            </div>
        </div>
    )
}

const Time = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString())

    setInterval(() => {
        setTime(new Date().toLocaleTimeString())
    }, 1000)
    return (
        <div className='flex gap-5 items-center font-bold text-md md:text-3xl 2xl:text-5xl'>
            <p>{new Date().toDateString()}</p>

            <p>{time}</p>
        </div>
    )
}

const IdleScreen: React.FC<IdleScreenProps> = ({ department }) => {
    return (
        <div className='h-3/4 opacity-50'>
            {department == 'ccs' ? (
                <img src={ccslogo} alt='' className='h-full' />
            ) : (
                <img src={coelogo} alt='' className='h-full rounded-full' />
            )}
        </div>
    )
}

const ActiveScreen: React.FC<ActiveScreenProps> = ({ data }) => {
    return (
        <div className='absolute flex flex-col bg-white rounded-lg items-center shadow-lg gap-10 p-5 2xl:p-20'>
            <div className='flex bg-white shadow-sm aspect-square w-[20rem] rounded-sm items-center justify-center'>
                {data.profilePicture ? (
                    <img
                        className='h-full object-cover'
                        alt={`${data.name}'s profile picture}`}
                        src={`${API_BASE_URL}/images/${data.profilePicture}`}></img>
                ) : (
                    <p className='text-lg'>No Image</p>
                )}
            </div>
            <div className='flex flex-col gap-3 items-center'>
                {data.timeOut === '--:--' ? (
                    <>
                        <p className='text-xl lg:text-lg'>{data.name}</p>
                        <div className='flex space-x-2'>
                            <p className='text-xl font-extrabold lg:text-lg'>Timed In: </p>
                            <p className='text-xl lg:text-lg'>{data.timeIn}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-xl lg:text-lg'>{data.name}</p>
                        <div className='flex space-x-2'>
                            <p className='text-xl font-extrabold lg:text-lg'>Timed Out: </p>
                            <p className='text-xl lg:text-lg'>{data.timeOut}</p>
                        </div>
                        <div className='flex space-x-2'>
                            <p className='text-xl font-extrabold lg:text-lg'>
                                Total Time Rendered:
                            </p>
                            <p className='text-xl lg:text-lg'>{data.totalTimeRendered}</p>
                        </div>
                    </>
                )}
                <p className='text-lg'>{data.idNumber}</p>
            </div>
        </div>
    )
}
export { Monitor }
