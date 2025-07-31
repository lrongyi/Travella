'use client'

import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import EditTrip from '../tripdetails/EditTrip'
import { TripWithLocation } from '../tripdetails/TripDetail'

interface EditContributorsButtonProps {
  trip: TripWithLocation
}

export default function EditContributorsButton({trip}: EditContributorsButtonProps) {

  const [isPopUp, setIsPopUp] = useState(false)

  return (
    <>
      <button className='flex gap-2 border-2 border-gray-700 rounded-xl shadow cursor-pointer lg:px-4 lg:py-2 px-2 py-2 items-center bg-white' onClick={() => {setIsPopUp(!isPopUp)}}>
            <Pencil />
            Edit Trip
      </button>

      { isPopUp &&
        <EditTrip trip={trip} onClose={() => setIsPopUp(false)}/>
      }
    </>
  )
}