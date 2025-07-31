import { Trash } from 'lucide-react'
import React from 'react'
import { TripWithLocation } from '../tripdetails/TripDetail'
import deleteTrip from '@/lib/actions/trips/delete-trip';
import { redirect } from 'next/navigation';

interface DeleteTripButtonProps {
    trip: TripWithLocation
}

export default function DeleteTripButton({trip}: DeleteTripButtonProps) {
    const handleDelete = async (tripId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this trip? \nAll contributors will no longer be able to see this trip.');
        if (confirmed) {
        try {
            await deleteTrip(tripId);
        } catch (error) {
            console.error('Failed to delete location:', error);
        } finally {
            redirect("/trips")
        }
        }
    };

    return (
        <button className='flex gap-2 border-2 border-red-400 px-4 py-2 rounded-xl shadow cursor-pointer bg-white' onClick={() => handleDelete(trip.id)}>
            <Trash className='text-red-400'/>
            <p className='text-red-400'>Delete Trip</p>
        </button>
    )
}
                        