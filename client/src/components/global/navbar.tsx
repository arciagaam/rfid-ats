import React, { FC } from 'react'
import { NavigationMenu } from '../ui/navigation-menu'

type Props = {
    children: string | JSX.Element | JSX.Element[]
}

const Navbar: FC<Props> = (props) => {
    return (
        <NavigationMenu orientation='vertical' className='fixed h-screen min-w-[14rem] max-w-[14rem] bg-slate-600 pt-6 flex flex-col gap-10'>
            {props.children}
        </NavigationMenu>
        // <div className="fixed h-screen min-w-[14rem] max-w-[14rem] bg-slate-600 pt-6 flex justify-center">
        //      { props.children }
        // </div>
    )
}

export default Navbar