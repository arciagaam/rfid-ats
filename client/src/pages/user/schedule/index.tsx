import ShowSchedule from '@/components/global/ShowSchedule';
import { useGetProfileQuery } from '@/slices/usersApiSlice';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Schedule = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const { data: user, refetch } = useGetProfileQuery(id);

  useEffect(() => {
      if (user) {
          setData(user);
      }

  }, [user, refetch]);

  return (
      <ShowSchedule data={data}/>
  )
}

export default Schedule