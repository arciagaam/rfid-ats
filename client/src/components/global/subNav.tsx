import React, { useState } from 'react'

const SubNav = ({...props}) => {
    const {icon, label, children, active} = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`transition-all rounded-lg relative text-primary-blue-900/50 hover:bg-primary-blue-500 flex items-start gap-2 cursor-pointer ${isOpen || active ? 'bg-primary-blue-500 text-white ' : ''}`}>
            <button onClick={() => setIsOpen(!isOpen)} className='rounded-lg flex gap-2 text-left items-center hover:bg-primary-blue-500 hover:text-white px-3 py-4 transition-all'>
                {isOpen || active ? icon.active : icon.inactive }
                <span>{label}</span>
            </button>

            <div onClick={() => setIsOpen(false)} className={`rounded-r-lg rounded-bl-lg overflow-clip absolute left-[100%] flex-col whitespace-nowrap text-black/30 shadow-md ${isOpen ? 'flex' : 'hidden'}`}>
                {children}
            </div>
        </div>
    )
}

export default SubNav