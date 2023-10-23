import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label'
import { useGetUsersQuery } from '@/slices/usersApiSlice'
import { Button } from '@/components/ui/button'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useLocation } from 'react-router-dom'

const SelectUsers = ({...props}) => {
    const location = useLocation();
    const type = Array.from(location.pathname.split('/')).at(-1);

    const {userList, setUserList, removeFromUserList} = props;

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const {data, refetch} = useGetUsersQuery(`role=${type}&search=${searchQuery}`)
    let timer;

    const handleInput = (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setSearchQuery(e.target.value);
        }, 100);
    }
    
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="users[]">Select Faculty Members</label>

            <div className="relative first:flex flex-col gap-2">

                <Input onFocus={() => setIsOpen(true)} onInput={handleInput} type='text' placeholder={`Search for ${type?.split('-').join(' ')} faculty`}/>

                <div className={`absolute top-[calc(100%+.75rem)] rounded-md left-0 w-full bg-white shadow-md flex flex-col items-start gap-2 ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col w-full items-start justify-start gap-1">
                        {data ? (data.length ? data.map((item, index: number) => <SearchItem key={index} user={item} setUserList={setUserList} setIsOpen={setIsOpen}/>) : <p className='text-sm text-black/40'>No results</p>) : <p className='text-sm text-black/40'>No Results</p>}
                    </div>
                    
                </div>

            </div>

            <div className="flex flex-col gap-2">
                {userList && userList.map((user, index: number) => <SelectedUser key={index} user={user} removeFromUserList={removeFromUserList}/>)}
            </div>


        </div>
    )
}

const SelectedUser = ({...props}) => {
    const {user, removeFromUserList} = props

    return(
        <div className="flex w-1/2 justify-between items-center bg-gray-100 rounded-lg p-2">
            <div className="flex flex-col">
                <p>{user.firstName} {user.middleName ?? ''} {user.lastName}</p>
                <p className='text-xs'>{user.role.toUpperCase()}</p>
            </div>

            <button type='button' className='aspect-square h-fit fill-red-500' onClick={() => {removeFromUserList(user)}}>
                <AiFillCloseCircle color="#ff5555" />
            </button>
        </div>
    )
}

const SearchItem = ({...props}) => {
    const {user, setUserList, setIsOpen} = props

    const handleUserSelect = (e) => {
        setUserList((prev) => [...prev, user]);
        setIsOpen(false)
    }
    
    return(
        <button type='button' onClick={handleUserSelect} className='w-full text-start text-sm hover:bg-gray-100 px-2 py-2'> 
            {user.firstName} {user.middleName ?? ''} {user.lastName}
        </button>
    )
}

export default SelectUsers