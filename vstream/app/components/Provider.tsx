"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react"

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider refetchOnWindowFocus={false}>
            {children}
        </SessionProvider>
    )
}

export default Provider
