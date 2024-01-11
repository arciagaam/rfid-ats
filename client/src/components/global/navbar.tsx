import React, { FC } from 'react'
import { NavigationMenu } from '../ui/navigation-menu'

type Props = {
    children: string | JSX.Element | JSX.Element[]
    department?: string
}

const Navbar: FC<Props> = (props) => {
    let bgColor = 'bg-primary-blue-500/20'

    if (props.department === 'coe') {
        bgColor = 'bg-yellow-200'
    }

    return (
        <NavigationMenu
            orientation='vertical'
            className={`shadow-md fixed h-screen min-w-[14rem] max-w-[14rem] py-6 px-4 flex flex-col gap-10 text-primary-blue-950 font-bold ${bgColor}`}>
            {props.children}
        </NavigationMenu>
    )
}

export default Navbar
