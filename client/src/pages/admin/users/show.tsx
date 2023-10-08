import { useGetUserQuery } from '@/slices/usersApiSlice';
import React from 'react'
import { useParams } from 'react-router-dom'

const ShowUser = () => {
    const { id } = useParams();
    const { data } = useGetUserQuery(id);

    console.log(data);
  return (
    <div>{id}</div>
  )
}

export default ShowUser