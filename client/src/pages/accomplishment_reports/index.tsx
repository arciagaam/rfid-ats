import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { useGetAccomplishmentReportsQuery } from '@/slices/accomplishmentReportApiSlice'
import AccomplishmentReportForm from './accomplishmentReportForm'
import { useLocation } from 'react-router-dom'



const AccomplishmentReport = () => {
  const location = useLocation();
  const type = Array.from(location.pathname.split('/')).at(-1);

  const [data, setData] = useState([])
  const { data: reports, refetch } = useGetAccomplishmentReportsQuery(`type=${type}`);

  useEffect(() => {
    if (reports) {
      const tableData = reports.map((report) => ({
        id: report._id,
        title: report.title,
        deadline: report.deadline,
        type: report.type,
        users: report.users
      }))
      setData(tableData)
    }
    refetch()
  }, [reports, refetch, location]);

  return (
    <div className='flex flex-col gap-10 text-[#1e1e1e]'>
      <div className='flex w-full justify-between'>
        <h1 className='text-xl font-bold'>Accomplishment Reports for {type == 'regular' ? 'Regular' : 'Part Time'} Faculty</h1>

        <Dialog>
          <DialogTrigger>
            <Button>Create Report</Button>
          </DialogTrigger>
          <DialogContent className='max-h-[80vh] min-w-[60%] overflow-scroll'>
            <DialogHeader>
              <DialogTitle>Create Report</DialogTitle>
            </DialogHeader>

            <AccomplishmentReportForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {data && data.map((report, index) => <ReportItem key={index} report={report} />)}
      </div>
    </div>
  )
}

const ReportItem = ({ report }) => {
  return (
    <div className="flex flex-col rounded-lg px-5 py-3 bg-white shadow-sm gap-3">
      <div className="flex flex-col">
        <h2 className='text-lg font-bold'>{report.title}</h2>
        <p className='text-sm'>{report.type.toUpperCase()}</p>
      </div>
      <hr />
      <p className='text-sm'>{report.users.length} Faculty Member/s</p>
    </div>
  )
}

export default AccomplishmentReport