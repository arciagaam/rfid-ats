import React, { useState } from 'react'

const SubNav = ({...props}) => {
    const {icon, label, children, active} = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative text-black/30 flex items-start gap-2 cursor-pointer ${isOpen || active ? 'bg-primary-purple-800 text-white' : ''}`}>
            <button onClick={() => setIsOpen(!isOpen)} className='flex gap-2 text-left items-center hover:bg-primary-purple-800 hover:text-white px-5 py-5 transition-all'>
                {isOpen || active ? icon.active : icon.inactive }
                <span>{label}</span>
            </button>

            <div onClick={() => setIsOpen(false)} className={`absolute left-[100%] flex-col whitespace-nowrap text-black/30 shadow-md ${isOpen ? 'flex' : 'hidden'}`}>
                {children}
            </div>
                {/* {({ isActive }) => (
            isActive ?
                <>
                    <MdAnalytics size={25} />
                    Accomplishment Reports
                </>
                :
                <>
                    <MdOutlineAnalytics size={25} />
                    Accomplishment Reports
                </>
        )} */}
        </div>
    )
}

export default SubNav