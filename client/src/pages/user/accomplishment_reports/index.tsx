import { useGetAccomplishmentReportsPerUserQuery } from '@/slices/accomplishmentReportApiSlice';
import { Dialog } from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react'

const AccomplishmentReport = () => {

  const [data, setData] = useState([])
  const { data: reports, refetch } = useGetAccomplishmentReportsPerUserQuery(null);

  useEffect(() => {
    if (reports) {
      const tableData = reports.map((report) => ({
        id: report._id,
        title: report.title,
        deadline: report.deadline,
        type: report.type,
      }))
      setData(tableData)
    }
    refetch()
  }, [reports, refetch]);

  console.log(data);

  return (
    <div className='flex flex-col gap-10 text-[#1e1e1e]'>
    <div className='flex w-full justify-between'>
      <h1 className='text-xl font-bold'>Accomplishment Reports</h1>
    </div>

    <div className="grid grid-cols-4 gap-5">
      {data && data.map((report, index) => <ReportItem key={index} report={report} />)}
    </div>
  </div>
  )
}

const ReportItem = ({ report }) => {
  const deadline = new Date(report.deadline).toDateString();
  return (
    <div className="flex flex-col rounded-lg px-5 py-3 bg-white shadow-sm gap-3">
      <div className="flex flex-col">
        <h2 className='text-lg font-bold'>{report.title}</h2>
        {/* <p className='text-sm'>{report.type.toUpperCase()}</p> */}
      </div>
      <hr />
      <p>Deadline: {deadline}</p>
    </div>
  )
}

export default AccomplishmentReport