import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserQuery } from '@/slices/usersApiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ScheduleForm from '@/util/scheduleform';
const ShowSchedule = () => {
    const { id } = useParams();
    const [data, setData] = useState();
    const { data: user, refetch } = useGetUserQuery(id);

    useEffect(() => {
        if (user) {
            setData(user);
            console.log(user.schedule)
        }

    }, [user, refetch]);

    const scheduleColumns = [];

    if (data?.schedule) {
        for (const day in data.schedule) {
            scheduleColumns.push(<ScheduleColumn key={day} day={day} scheduleList={data.schedule} />)
        }
    }

    return (
        <div className='flex flex-col gap-10 text-[#1e1e1e]'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Faculty Schedule</h1>
            </div>

            <Card>
                <CardContent>

                    <div className="flex flex-col gap-3 py-5">
                        <div className="flex justify-between w-full">
                            <h2 className='text-lg font-medium'>Schedule of {data?.firstName} {data?.middleName ?? ''} {data?.firstName}</h2>
                            <Dialog>
                                <DialogTrigger>
                                    <Button>Edit Schedule</Button>
                                </DialogTrigger>
                                <DialogContent className='max-h-[80vh] min-w-[60%] overflow-scroll'>
                                    <DialogHeader>
                                        <DialogTitle>Edit User Schedule</DialogTitle>
                                    </DialogHeader>

                                    <ScheduleForm isEdit={true}/>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="flex gap-2">
                            {scheduleColumns.map(col => col)}
                        </div>

                    </div>

                </CardContent>
            </Card>
        </div >
    )
}

const ScheduleColumn = ({ ...props }) => {
    const { day, scheduleList } = props;

    return (
        <div className="flex flex-col gap-3 flex-1">
            <Cell className='font-bold' allowDelete={false}>
                <h2>{capitalizeFirstLetter(day)}</h2>
            </Cell>

            {scheduleList[day] && scheduleList[day].map((_: object, index: number) =>
            (
                <Cell key={index}>
                    <ScheduleCell day={day} rowIndex={index} scheduleList={scheduleList} />
                </Cell>
            )
            )}

        </div>
    )
}

const ScheduleCell = ({ ...props }) => {
    const { day, rowIndex, scheduleList } = props;


    return (
        <div className="flex flex-col text-sm gap-3">
            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-subject`}>Subject</label>
                <input readOnly disabled name={`${day}-${rowIndex}-subject`} id={`${day}-${rowIndex}-subject`} type="text" value={scheduleList[day][rowIndex].subject} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeStart`}>Time Start</label>
                <input readOnly disabled name={`${day}-${rowIndex}-timeStart`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeStart} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeEnd`}>Time End</label>
                <input readOnly disabled name={`${day}-${rowIndex}-timeEnd`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeEnd} />
            </div>
        </div>
    )
}

const Cell = ({ children, ...props }) => {
    const { className } = props;
    return (
        <div className={`relative flex items-center justify-center rounded-lg p-3 bg-gray-100 ${className}`}>
            {children}
        </div>
    )
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default ShowSchedule