
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import ScheduleForm from '@/util/scheduleform';

const ShowSchedule = ({data, isAdmin}) => {
    const scheduleColumns = [];
    if (data?.schedule) {
        for (const day in data.schedule) {
            scheduleColumns.push(<ScheduleColumn key={day} day={day} scheduleList={data.schedule} />)
        }
    }

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex w-full justify-between'>
                <h1 className='text-xl font-bold'>Faculty Schedule</h1>
            </div>

            <Card className='bg-primary-blue-50/20 border-0 shadow-md'>
                <CardContent>

                    <div className="flex flex-col gap-3 py-5">
                        <div className="flex justify-between w-full">
                            <h2 className='text-lg font-medium'>Schedule of {data?.firstName} {data?.middleName ?? ''} {data?.firstName}</h2>

                            {isAdmin && 
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
                            }

                        </div>

                        {
                            data?.schedule 
                            ? <div className="flex gap-2">
                                {scheduleColumns.map(col => col)}
                            </div>
                            : <div className="flex">No schedule is available for this user.</div>

                        }


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
                <input className='bg-white border-b border-primary-blue-950/10' readOnly disabled name={`${day}-${rowIndex}-subject`} id={`${day}-${rowIndex}-subject`} type="text" value={scheduleList[day][rowIndex].subject} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeStart`}>Time Start</label>
                <input className='bg-white border-b border-primary-blue-950/10' readOnly disabled name={`${day}-${rowIndex}-timeStart`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeStart} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeEnd`}>Time End</label>
                <input className='bg-white border-b border-primary-blue-950/10' readOnly disabled name={`${day}-${rowIndex}-timeEnd`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeEnd} />
            </div>
        </div>
    )
}

const Cell = ({ children, ...props }) => {
    const { className } = props;
    return (
        <div className={`relative flex items-center justify-center rounded-lg p-3 bg-white ring-1 ring-primary-blue-950/10 ${className}`}>
            {children}
        </div>
    )
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ShowSchedule
