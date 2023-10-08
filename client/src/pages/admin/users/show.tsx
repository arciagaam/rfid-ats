import { useGetUserQuery } from '@/slices/usersApiSlice';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { setDate } from 'date-fns';
import { Log } from './columns';
const ShowUser = () => {


  const [data, setData] = useState();

  const { id } = useParams();
  const { data: user } = useGetUserQuery(id);
  const navigate = useNavigate();

  //create type for profile
  //display profile data

  useEffect(() => {
    if(user) {
      setData(user);
    }
  }, [user]);


  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2">
          <button className='flex gap-2 items-center hover:underline ' onClick={() => { navigate('/admin/users') }}>
            <BiArrowBack />
            Back to Users
          </button>
          <h1 className='text-lg font-bold'>User Profile</h1>
        </div>

        <div className="grid grid-cols-3">

          <div className="flex flex-col">
            <h3>First Name</h3>
            <p>{data?.firstName}</p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default ShowUser