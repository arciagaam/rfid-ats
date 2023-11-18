import { formatDate, formatTime } from '@/util/formatter';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AttendanceTablePrint = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('print') == null) {
            navigate('/admin/home');
        }
    }, [])

    const data = localStorage.getItem('print') ?? null;

    if(!data) {
        return false;
    }

    const attendance = JSON.parse(data!).data;

    setTimeout(() => {
        window.print();
        window.close();
        localStorage.removeItem('print');
    }, 200)

    if (attendance.length) {
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
    } else {
        return(
            <div className="flex">
                <h2 className='text-xl font-bold'>No attendance recorded for this day.</h2>
            </div>
        )
    }
}

export default AttendanceTablePrint