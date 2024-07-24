import React, { ReactNode } from "react"

interface HeaderProps {
    children: ReactNode
}

export const Header: React.FC<HeaderProps> = ({children}: HeaderProps) => {
    return (
        <h1 className='my-5 text-4xl font-extrabold dark:text-black'>{children}</h1>
    )
}