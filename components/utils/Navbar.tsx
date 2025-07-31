'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/lib/auth-actions';
import { Session } from "next-auth"
import SignInButton from './SignInButton';

export default function Navbar({session}: {session: Session | null}) {
  return (
    <nav className='bg-white shadow-md py-2 border-b border-gray-200'>
        <div className='container mx-auto flex justify-between items-center px-6 lg:px-8'>
            <Link href={"/"} className='flex items-center'>
                <div className='flex items-center'>
                    <Image src={"/destination.png"} alt="logo" width={50} height={50} />
                    <span className='text-2xl text-gray-800 font-bold mx-4 hover:text-sky-500'>Travella</span>
                </div>
            </Link>

            <div className='flex space-x-4 items-center'>
                {session ? (
                    <>
                        <Link href={"/trips"} className='text-slate-900 hover:text-sky-500'>My Trips</Link>
                        <Link href={"/globe"} className='text-slate-900 hover:text-sky-500'>Globe</Link>

                        <button className='flex items-center justify-center bg-gray-700 hover:bg-gray-500 hover:text-sky-500 text-white p-2 rounded-xl cursor-pointer'
                        onClick={logout}
                        >Sign Out</button>
                    </>
                ) : (
                    <SignInButton />
                )}
                

                
            </div>
            
        </div>
    </nav>
  )
}
