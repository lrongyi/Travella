import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function NewTripButton() {
  return (
    <Link href={"/trips/new"}>
      <button className='flex gap-2 border-2 border-gray-700 rounded-xl shadow cursor-pointer lg:px-4 lg:py-2 px-2 py-2 items-center bg-white'>
          <Plus />
          New Trip
      </button>
    </Link>
  )
}
