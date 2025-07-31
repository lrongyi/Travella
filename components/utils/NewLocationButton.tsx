import { Trip } from '@/app/generated/prisma'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface NewLocationButtonProp {
    trip: Trip
}

export default function NewLocationButton({trip}: NewLocationButtonProp) {
  return (
    <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <div>
                        <button className='flex gap-2 border-2 border-gray-500 px-4 py-2 rounded-xl shadow cursor-pointer bg-white'>
                            <Plus/>
                            Add Location
                        </button>
                    </div>
                </Link>
  )
}
