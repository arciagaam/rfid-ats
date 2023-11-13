import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetAccomplishmentReportByIdQuery } from '@/slices/accomplishmentReportApiSlice';
import { API_BASE_URL } from '@/constants/constants';
import { Input } from '@/components/ui/input';

const ShowAccomplishmentReport = ({isAdmin=false}) => {

  const { user_id, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({})
  const { data: accomplishmentReport, refetch } = useGetAccomplishmentReportByIdQuery(id)
  
  useEffect(() => {
    if (accomplishmentReport) {
      setData(accomplishmentReport);
      setIsLoading(false);
    }
    
  }, [accomplishmentReport, refetch])

  if(!isLoading) {
    return (
      <div className="flex flex-col gap-5">

        <Link to={ !isAdmin ? '/accomplishment-reports' : '../'}>{"<"} Back</Link>
  
        <div className="flex gap-5">
          <div className="h-14 aspect-square bg-blue-400 rounded-full"></div>
  
          <div className="flex flex-col text-black/70 gap-2">
            <h1 className='text-xl font-bold text-black'>{data.title}</h1>
            
            <div className="flex flex-col text-sm">
              <p>{data.user.email}</p>
              <p>{data.type}</p>
            </div>
          </div>
        </div>
  
        <hr />
  
        <div className="flex flex-col text-sm">
          <p><span className='font-medium'>Submitted by</span> {data.user.firstName} {data.user.middleName ?? ''} {data.user.lastName}</p>
          <p><span className='font-medium'>Submitted on</span> {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>

        <hr />
  
        <div className="flex flex-col gap-10">
          {
            data.file &&
            <div className="flex flex-col">
              <h2 className='font-bold text-lg'>Attachment:</h2>
              <a download={data.file.fileName} title='Download' target="_blank" href={`${API_BASE_URL}/${data.file.filePath}`} className='flex flex-row items-center gap-5 bg-white rounded-lg w-fit p-5 shadow-sm'>
                <div className="h-14 aspect-square bg-blue-400 rounded-full"></div>
                <p>{data.file.fileName}</p>
              </a>
            </div>
          }
          {
            (data.link != '' && data.link)  &&
            <div className="flex flex-col">
              <h2 className='font-bold text-lg'>Link:</h2>
              <a target='_blank' href={data.link}>{data.link}</a>
            </div>
          }
          {
            !((data.link != '' && data.link) && data.file) &&
            <div className="flex flex-col">
              <h2 className='font-bold text-lg'>There's nothing to see here.</h2>
            </div>
          }
        </div>

      </div>
    )
  }

}

export default ShowAccomplishmentReport