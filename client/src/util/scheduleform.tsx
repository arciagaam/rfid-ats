import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react'
import { Log, IUserRow } from '@/pages/admin/users/columns';
import { useGetUserQuery, useGetUsersQuery } from '@/slices/usersApiSlice';
import { useAttachScheduleMutation } from '@/slices/usersApiSlice';
import { toast } from 'react-toastify';
import { IErrorResponse } from '@/types';
import { BsFillTrashFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const defaultData = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
}

const ScheduleForm = ({isEdit}) => {

    const {id} = useParams();

    const [usersList, setUsersList] = useState<Log[]>([]);
    const [scheduleList, setScheduleList] = useState({ ...defaultData });

    const [selectedUser, setSelectedUser] = useState<string>('');
    const { data: users, refetch: refetchUsers } = useGetUsersQuery(null);
    const {data: user, refetch: refetchUser} = useGetUserQuery(id);

    const [attachSchedule, { isLoading: loadingAttach }] = useAttachScheduleMutation();

    useEffect(() => {
        if(!isEdit) return;

        if(user) {
            setSelectedUser(user._id);
            setScheduleList(user.schedule);
        }
        
     }, [user, refetchUser]);

    useEffect(() => {
        if (users) {
            const tableData = users.map((user: IUserRow) => ({
                id: user._id,
                name: `${user.firstName} ${user.middleName ?? ''} ${user.lastName}`,
                email: user.email,
                role: user.role,
                status: user.status,
            }))
            setUsersList(tableData)
        }
        refetchUsers()
    }, [users, refetchUsers]);

    const addCell = (day: string) => {
        setScheduleList((prev) => ({ ...prev, [day]: [...prev[day], { subject: '', timeStart: '', timeEnd: '' }] }));
    }

    const deleteCell = (day: string | number, row: string | number) => {
        setScheduleList(prev => ({...prev, [day]: prev[day].filter((_: object, index: number) => row != index)}));
    }

    const updateCell = (day: string, rowIndex: number, cellValues: object) => {
        const dayArray = scheduleList[day].map((schedule) => schedule);
        dayArray[rowIndex] = cellValues;

        setScheduleList((prev) => ({...prev, [day]: dayArray}));
    }

    const handleSaveSchedule = async () => {
        try {
            await attachSchedule({
                userId: selectedUser,
                schedule: scheduleList,
            }).unwrap();

            toast.success("Schedule created")
        } catch (error) {
            toast.error((error as IErrorResponse)?.data?.message || (error as IErrorResponse).error)
        }
    }

    const scheduleColumns = []; 
    for(const day in scheduleList) {
        scheduleColumns.push(<ScheduleColumn key={day} day={day} updateCell={updateCell} addCell={addCell} deleteCell={deleteCell} scheduleList={scheduleList} />)    
    }

    return (
        <div className="flex flex-col gap-5">

            <div className="flex flex-col">
                {!isEdit &&
                <Select value={selectedUser} onValueChange={(value) => setSelectedUser(value)}>
                    <SelectTrigger className='w-1/2'>
                        <SelectValue placeholder="Select Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                        {usersList && usersList.map((user, index) =>
                            <SelectItem key={index} value={user.id}>{user.name}</SelectItem>
                        )}

                    </SelectContent>
                </Select>
                }
            </div>


            <div className="flex gap-2">
                {scheduleColumns.map(col => col)}
            </div>

            <Button onClick={handleSaveSchedule}>Save</Button>

        </div>
    )
}

const ScheduleColumn = ({...props}) => {
    const {day, updateCell, addCell, deleteCell, scheduleList} = props;

    return(
        <div className="flex flex-col gap-3 flex-1">
        <Cell className='font-bold' allowDelete={false}>
            <h2>{capitalizeFirstLetter(day)}</h2>
        </Cell>

        {scheduleList[day] && scheduleList[day].map((_: object, index: number) =>
            (
                <Cell key={index} deleteCell={() => deleteCell(day, index)}>
                    <ScheduleCell day={day} rowIndex={index} updateCell={updateCell} scheduleList={scheduleList} />
                </Cell>
            )
        )}

        <Button onClick={() => { addCell(day) }}>Add Cell</Button>
    </div>
    )
}

const ScheduleCell = ({ ...props }) => {
    const { day, rowIndex, updateCell, scheduleList } = props;

    const cellValues = {
        subject: scheduleList[day][rowIndex].subject,
        timeStart: scheduleList[day][rowIndex].timeStart,
        timeEnd: scheduleList[day][rowIndex].timeEnd,
    }

    const handleChange = (key, value) => {
        cellValues[key] = value;
        updateCell(day, rowIndex, cellValues)
    }

    return (
        <div className="flex flex-col text-sm gap-3">
            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-subject`}>Subject</label>
                <input onChange={(e) => { handleChange('subject', e.target.value) }} name={`${day}-${rowIndex}-subject`} id={`${day}-${rowIndex}-subject`} type="text" value={scheduleList[day][rowIndex].subject} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeStart`}>Time Start</label>
                <input onChange={(e) => { handleChange('timeStart', e.target.value) }} name={`${day}-${rowIndex}-timeStart`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeStart} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeEnd`}>Time End</label>
                <input onChange={(e) => { handleChange('timeEnd', e.target.value) }} name={`${day}-${rowIndex}-timeEnd`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeEnd} />
            </div>
        </div>
    )
}

const Cell = ({ children, ...props }) => {
    const { className, deleteCell, allowDelete=true } = props;
    return (
        <div className={`relative flex items-center justify-center rounded-lg p-3 bg-gray-100 ${className}`}>
            {allowDelete && 
                <button className='absolute top-2 right-2 ' onClick={() => deleteCell()}>
                    <BsFillTrashFill className="fill-black/20 hover:fill-red-400"/>
                </button>
            }
            {children}
        </div>
    )
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ScheduleForm