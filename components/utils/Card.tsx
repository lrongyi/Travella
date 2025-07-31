import React from 'react'
import clsx from 'clsx'

interface CardProps {
    children: React.ReactNode
    className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('bg-white p-4 rounded-xl space-y-4 border-2 border-slate-700 shadow-sm', className)}>
        {children}
    </div>
  )
}
