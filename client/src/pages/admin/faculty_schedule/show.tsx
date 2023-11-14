import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserQuery } from '@/slices/usersApiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ScheduleForm from '@/util/scheduleform';
import ShowSchedule from '@/components/global/ShowSchedule';
const AdminShowSchedule = () => {
    const { id } = useParams();
    const [data, setData] = useState();
    const { data: user, refetch } = useGetUserQuery(id);

    useEffect(() => {
        if (user) {
            setData(user);
        }

    }, [user, refetch]);

    return (
        <ShowSchedule data={data} isAdmin={true}/>
    )
}

export default AdminShowSchedule
