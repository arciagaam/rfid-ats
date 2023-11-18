import { formatDate, formatTime } from '@/util/formatter';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AttendanceTablePrint = () => {


    useEffect(() => {
        if (!localStorage.getItem('print')) window.close();
    }, [])

    const attendance = JSON.parse(localStorage.getItem('print')!).data

    setTimeout(() => {
        window.print();
        window.close();
    }, 200)

    return (
        <div className="flex flex-col gap-5">

            <h2 className='text-2xl'>Attendance Report - {formatDate(new Date(attendance[0].date))}</h2>

            <table className='border'>
                <thead>
                    <tr>
                        <th className='py-2 px-2'>Date</th>
                        <th>Name</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Total Time Rendered</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        attendance.map((item, index: number) => (

                            <tr key={index} className='border text-center'>
                                <td className='py-2 px-2'>{formatDate(new Date(item.date))}</td>
                                <td>
                                    <p>
                                        {item.user.firstName} {item.user.middleName ?? ''} {item.user.lastName}
                                    </p>
                                </td>
                                <td>{formatTime(item.timeIn)}</td>
                                <td>{formatTime(item.timeOut)}</td>
                                <td>{formatTime(item.totalTimeRendered)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div>
    )
}

export default AttendanceTablePrint