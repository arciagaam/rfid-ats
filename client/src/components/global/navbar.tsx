import React, { FC } from 'react'
import { NavigationMenu } from '../ui/navigation-menu'

type Props = {
    children: string | JSX.Element | JSX.Element[]
}

const Navbar: FC<Props> = (props) => {
    return (
        <NavigationMenu orientation='vertical' className='shadow-md fixed h-screen min-w-[14rem] max-w-[14rem] py-6 px-4 flex flex-col gap-10 text-primary-blue-950 bg-primary-blue-50/20'>
            {props.children}
        </NavigationMenu>
    )
}

export default Navbar