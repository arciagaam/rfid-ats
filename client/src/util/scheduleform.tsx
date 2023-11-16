import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react'
import { Log, IUserRow } from '@/pages/admin/users/columns';
import { useGetUserQuery, useGetUsersQuery } from '@/slices/usersApiSlice';
import { useAttachScheduleMutation } from '@/slices/usersApiSlice';
import { toast } from 'react-toastify';
import { IErrorResponse, IUserSelect } from '@/types';
import { BsFillTrashFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const defaultData = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
}

const ScheduleForm = ({ isEdit }) => {

    const { id } = useParams();

    const [usersList, setUsersList] = useState<Log[]>([]);
    const [scheduleList, setScheduleList] = useState({ ...defaultData });
    const [selectedUser, setSelectedUser] = useState<string>('');

    const { data: users, refetch: refetchUsers } = useGetUsersQuery(null);
    const { data: user, refetch: refetchUser } = useGetUserQuery(id);

    const [attachSchedule, { isLoading: loadingAttach }] = useAttachScheduleMutation();

    useEffect(() => {
        if (!isEdit) return;

        if (user) {
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
        setScheduleList(prev => ({ ...prev, [day]: prev[day].filter((_: object, index: number) => row != index) }));
    }

    const updateCell = (day: string, rowIndex: number, cellValues: object) => {
        const dayArray = scheduleList[day].map((schedule) => schedule);
        dayArray[rowIndex] = cellValues;

        setScheduleList((prev) => ({ ...prev, [day]: dayArray }));
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
    for (const day in scheduleList) {
        scheduleColumns.push(<ScheduleColumn key={day} day={day} updateCell={updateCell} addCell={addCell} deleteCell={deleteCell} scheduleList={scheduleList} />)
    }

    return (
        <div className="flex flex-col gap-5">

            <div className="flex flex-col">
                {!isEdit &&
                    <UserSelect selectedUser={selectedUser} setSelectedUser={setSelectedUser} users={usersList} />

                    // <Select value={selectedUser} onValueChange={(value) => setSelectedUser(value)}>
                    //     <SelectTrigger className='w-1/2'>
                    //         <SelectValue placeholder="Select Faculty" />
                    //     </SelectTrigger>
                    //     <SelectContent>
                    //         {usersList && usersList.map((user, index) =>
                    //             <SelectItem key={index} value={user.id}>{user.name}</SelectItem>
                    //         )}

                    //     </SelectContent>
                    // </Select>
                }
            </div>


            <div className="flex gap-2">
                {scheduleColumns.map(col => col)}
            </div>

            <Button onClick={handleSaveSchedule}>Save</Button>

        </div>
    )
}

const ScheduleColumn = ({ ...props }) => {
    const { day, updateCell, addCell, deleteCell, scheduleList } = props;

    return (
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
                <input className='bg-transparent p-2 focus-visible:outline-none focus-visible:border-primary-blue-950/50 border-b border-primary-blue-950/10' onChange={(e) => { handleChange('subject', e.target.value) }} name={`${day}-${rowIndex}-subject`} id={`${day}-${rowIndex}-subject`} type="text" value={scheduleList[day][rowIndex].subject} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeStart`}>Time Start</label>
                <input className='bg-transparent p-2 focus-visible:outline-none focus-visible:border-primary-blue-950/50 border-b border-primary-blue-950/10' onChange={(e) => { handleChange('timeStart', e.target.value) }} name={`${day}-${rowIndex}-timeStart`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeStart} />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor={`${day}-${rowIndex}-timeEnd`}>Time End</label>
                <input className='bg-transparent p-2 focus-visible:outline-none focus-visible:border-primary-blue-950/50 border-b border-primary-blue-950/10' onChange={(e) => { handleChange('timeEnd', e.target.value) }} name={`${day}-${rowIndex}-timeEnd`} id={`${day}-${rowIndex}-subject`} type="time" value={scheduleList[day][rowIndex].timeEnd} />
            </div>
        </div>
    )
}

const Cell = ({ children, ...props }) => {
    const { className, deleteCell, allowDelete = true } = props;
    return (
        <div className={`relative flex items-center justify-center rounded-lg p-3 bg-primary-blue-50/20 ring-1 ring-primary-blue-950/10 ${className}`}>
            {allowDelete &&
                <button className='absolute top-2 right-2 ' onClick={() => deleteCell()}>
                    <BsFillTrashFill className="fill-black/20 hover:fill-red-400" />
                </button>
            }
            {children}
        </div>
    )
}

const UserSelect = ({ selectedUser, setSelectedUser, users }) => {
    type UserSelect = {
        id: string,
        name: string,
    }

    const usersArray = users
    ? users.map((user: UserSelect) => ({
        key: user.id,
        value: user.name,
        label: user.name,
    }))
    : [];

    const [selectUsers, setSelectUsers] = useState([]);
    
    useEffect(() => {
        setSelectUsers(users.map((user: UserSelect) => ({
            key: user.id,
            value: user.name,
            label: user.name,
        })))
    }, [users])

    const [open, setOpen] = useState(false)

    function handleSearch(e: Event) {
        setSelectUsers(usersArray.filter((user) => user.value.toLowerCase().trim().includes(e.target.value.toLowerCase()))); 
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'>
                    {selectedUser
                        ? selectUsers.find((user: IUserSelect) => user.key === selectedUser)?.label
                        : 'Select user'}
                    <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command shouldFilter={false}>
                    <CommandInput onInput={handleSearch} placeholder='Search user...' className='h-9' />
                    <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                            {selectUsers &&
                                selectUsers.map((user: IUserSelect) => (
                                    <CommandItem
                                        key={user.key}
                                        value={user.key}
                                        onSelect={(currentValue) => {
                                            setSelectedUser(currentValue === selectedUser ? '' : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {user.label}
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                selectedUser === user.key ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default ScheduleForm