import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AccomplishmentReportForm from '@/pages/admin/accomplishment_reports/accomplishmentReportForm';
import { useGetAccomplishmentReportsPerUserQuery } from '@/slices/accomplishmentReportApiSlice';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

const AccomplishmentReport = ({ isAdmin=false }) => {
  const {user_id} = useParams();
  const [data, setData] = useState([])
  const { data: reports, refetch } = useGetAccomplishmentReportsPerUserQuery(user_id);

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

  return (
    <div className='flex flex-col gap-10 text-[#1e1e1e]'>
      <div className='flex w-full justify-between'>
        <div className="flex flex-col gap-2">
          {isAdmin &&
          <Link to={ '../.'}>{"<"} Back</Link>
          }
          <h1 className='text-xl font-bold'>Accomplishment Reports</h1>
        </div>

        {!isAdmin &&
          <Dialog>
            <DialogTrigger>
              <Button>Create Report</Button>
            </DialogTrigger>
            <DialogContent className='max-h-[80vh] min-w-[60%] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create Report</DialogTitle>
              </DialogHeader>

              <AccomplishmentReportForm refetch={refetch} />
            </DialogContent>
          </Dialog>
        }
      </div>

      <div className="grid grid-cols-4 gap-5">

        

        {data.length ? data.map((report, index) => <ReportItem key={index} report={report} />) : "No records found."}
      </div>
    </div>
  )
}

const ReportItem = ({ report }) => {
  const deadline = new Date(report.deadline).toDateString();
  return (
    <Link to={`${report.id}`} className="flex flex-col rounded-lg px-5 py-3 bg-white shadow-sm gap-3">
      <div className="flex flex-col">
        <h2 className='text-lg font-bold'>{report.title}</h2>
        {/* <p className='text-sm'>{report.type.toUpperCase()}</p> */}
      </div>
    </Link>
  )
}

export default AccomplishmentReport