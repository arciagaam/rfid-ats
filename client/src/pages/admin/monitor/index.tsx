import React, { useEffect, useRef, useState } from 'react'
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
        isTimeIn: boolean
        AmTimeIn: string
        AmTimeOut: string
        PmTimeIn: string
        PmTimeOut: string
        name: string
        idNumber: string
        totalTimeRendered: string
        profilePicture: string
    }
}

function checkIfAfternoon() {
    const now = new Date();
    const hour = now.getHours();

    return (hour >= 12 && hour <= 23)
}

const Monitor = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth)
    const { role, department } = userInfo
    const [data, setData] = useState(null)
    const timeout = useRef();

    let bgColor

    if (department === 'ccs') {
        bgColor = 'bg-primary-blue-500/20'
    } else {
        bgColor = 'bg-yellow-300'
    }

    
    useEffect(() => {
        const socket = io(API_BASE_URL)

        socket.on('newLog', (newLogData) => {
            clearTimeout(timeout.current)
            const isTimeIn = (newLogData.AmTimeOut === null && newLogData.PmTimeOut === null)

            const formattedDate = formatDate(new Date(newLogData.date))

            const formattedAMTimeIn = newLogData.AmTimeIn ? formatTime(newLogData.AmTimeIn) : '--:--'
            const formattedAMTimeOut = newLogData.AmTimeOut ? formatTime(newLogData.AmTimeOut) : '--:--'

            const formattedPMTimeIn = newLogData.PmTimeIn ? formatTime(newLogData.PmTimeIn) : '--:--'
            const formattedPMTimeOut = newLogData.PmTimeOut ? formatTime(newLogData.PmTimeOut) : '--:--'

            newLogData.isTimeIn = isTimeIn;
            newLogData.date = formattedDate
            newLogData.AmTimeIn = formattedAMTimeIn
            newLogData.AmTimeOut = formattedAMTimeOut
            newLogData.PmTimeIn = formattedPMTimeIn
            newLogData.PmTimeOut = formattedPMTimeOut
            newLogData.totalTimeRendered = newLogData.totalTimeRendered ?? '--:--'
            newLogData.name = newLogData.userName
            newLogData.updatedAt = new Date().toISOString()
            

            setData(newLogData)
            startTimeout()
        })

        return () => {
            socket.disconnect()
            clearTimeout(timeout.current)
        }
    }, [])

    const startTimeout = () => {
        timeout.current = setTimeout(() => {
            setData(null)
        }, 5000)
    }

    return (
        <div className='flex flex-col h-screen max-h-screen w-full'>
            <div className={`flex w-full justify-center gap-20 ${bgColor} p-5`}>
                <div className='aspect-square rounded-full p h-[20vh] w-[20vh] self-center'>
                    {department == 'ccs' ? (
                        <img src={ccslogo} alt='' className='object-contain rounded-full overflow-clip h-[20vh] w-[20vh]' />
                    ) : (
                        <img src={coelogo} alt='' className='object-contain rounded-full overflow-clip h-[20vh] w-[20vh]' />
                    )}
                </div>

                <div className='flex flex-col'>
                    <h2 className='font-bold text-xl md:text-2xl lg:text-4xl 2xl:text-5xl'>
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

            <div className='relative flex w-full items-center justify-center py-10 flex-1 max-h-full'>
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
                <img src={ccslogo} alt='' className='h-[43vh]' />
            ) : (
                <img src={coelogo} alt='' className='h-[43vh] rounded-full' />
            )}
        </div>
    )
}

const ActiveScreen: React.FC<ActiveScreenProps> = ({ data }) => {
    return (
        <div className='flex flex-col bg-white rounded-lg items-center shadow-lg gap-10 p-5 h-fit'>
            <div className='flex bg-white shadow-sm aspect-square w-[24rem] rounded-sm items-center justify-center'>
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
                {data.isTimeIn ? (
                    <>
                        <p className='text-xl lg:text-lg'>{data.name}</p>
                        <div className='flex space-x-2'>

                            
                            <p className='text-xl font-extrabold lg:text-lg'>{checkIfAfternoon() ? 'PM IN: ' : 'AM IN: '}</p>
                            <p className='text-xl lg:text-lg'>{checkIfAfternoon() ? data.PmTimeIn : data.AmTimeIn}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-xl lg:text-lg'>{data.name}</p>
                        <div className='flex space-x-2'>
                            <p className='text-xl font-extrabold lg:text-lg'>{checkIfAfternoon() ? 'PM OUT: ' : 'AM OUT: '}</p>
                            <p className='text-xl lg:text-lg'>{checkIfAfternoon() ? data.PmTimeOut : data.AmTimeOut}</p>
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
