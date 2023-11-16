import React, { useEffect, useState } from 'react'
import { useGetAccomplishmentReportsQuery } from '@/slices/accomplishmentReportApiSlice'
import { useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/global/datatable/dataTable'
import { FormModalBtn } from '@/components/global/formModalBtn'
import UserForm from '@/util/userform'
import { Button } from '@/components/ui/button'
import { useGetUsersQuery } from '@/slices/usersApiSlice'
import { IUserRow } from '../users/columns'
import { io } from 'socket.io-client'
import { ArUsers, columns } from './columns'

const AccomplishmentReport = () => {
    const location = useLocation()
    const type = Array.from(location.pathname.split('/')).at(-1)

    const [data, setData] = useState<ArUsers[]>([])

    const { data: users, refetch } = useGetUsersQuery(`role=${type}&status=active`)

    useEffect(() => {
        if (users) {
            const tableData = users.map((user: IUserRow) => ({
                id: user._id,
                name: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
                email: user.email,
                role: user.role,
                status: user.status,
            }))
            setData(tableData)
        }
        refetch()
    }, [users, refetch])

    useEffect(() => {
        const socket = io('http://127.0.0.1:3001')
        socket.on('new_user', (content) => {
            refetch()
        })
        return () => {
            socket.disconnect()
        }
    }, [])

  return (
    <div className='flex flex-col gap-10 text-[#1e1e1e]'>
      <div className='flex w-full justify-between'>
        <h1 className='text-xl font-bold'>Accomplishment Reports</h1>
      </div>
      <Card className='bg-primary-blue-50/20 border-0 shadow-md'>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            columnSearch='name'
          />
        </CardContent>
      </Card>
    </div>
  )


    // const location = useLocation();
    // const type = Array.from(location.pathname.split('/')).at(-1);

    // const [data, setData] = useState([])
    // const { data: reports, refetch } = useGetAccomplishmentReportsQuery(`type=${type}`);

    // useEffect(() => {
    //   if (reports) {
    //     const tableData = reports.map((report) => ({
    //       id: report._id,
    //       title: report.title,
    //       deadline: report.deadline,
    //       type: report.type,
    //       users: report.users
    //     }))
    //     setData(tableData)
    //   }
    //   refetch()
    // }, [reports, refetch, location]);

    // return (
    //   <div className='flex flex-col gap-10 text-[#1e1e1e]'>
    //     <div className='flex w-full justify-between'>
    //       <h1 className='text-xl font-bold'>Accomplishment Reports for {type == 'regular' ? 'Regular' : 'Part Time'} Faculty</h1>
    //     </div>

    //     <div className="grid grid-cols-4 gap-5">
    //       {data && data.map((report, index) => <ReportItem key={index} report={report} />)}
    //     </div>
    //   </div>
    // )
}

// const ReportItem = ({ report }) => {
//   return (
//     <div className="flex flex-col rounded-lg px-5 py-3 bg-white shadow-sm gap-3">
//       <div className="flex flex-col">
//         <h2 className='text-lg font-bold'>{report.title}</h2>
//         <p className='text-sm'>{report.type.toUpperCase()}</p>
//       </div>
//       <hr />
//     </div>
//   )
// }

export default AccomplishmentReport
