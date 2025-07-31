import React from 'react'
import { auth } from "@/auth"
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import NewTripButton from '@/components/utils/NewTripButton';
import Card from '@/components/utils/Card';

export default async function Tripspage() {
    
    const session = await auth();
    const trips = await prisma.trip.findMany({
        where: {userId: session?.user?.id}
    })

    const sharedTrips = await prisma.contributorsToTrip.findMany({
        where: {userId: session?.user?.id},
        include: {
            trip: true
        }
    })

    const sortedTrips = [...trips].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!session) {
        return <div className='flex justify-center items-center h-screen text-gray-700 text-xl'>Please Sign In</div>;
    }
  
    return (
        <div className='space-y-6 container mx-auto px-4 py-8'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Welcome back, {session.user?.name}
                </h1>
                <NewTripButton></NewTripButton>
                  
            </div>

            <div>
                {trips.length === 0 
                ? (
                    <Card>
                        <div className='space-y-4'>
                            <h2 className='text-black text-center'>No trips planned.</h2>
                            <div className='flex justify-center'>
                                <NewTripButton></NewTripButton>
                            </div>
                        </div> 
                    </Card>
                )
                
                : <div>
                        <h2 className='text-xl font-semibold mb-4'>Your Trips</h2>
                        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {sortedTrips.map((trip, key) => (<Link key={key} href={`/trips/${trip.id}`}>
                            <Card className='hover:shadow-md transistion-shadow duration-200 relative'>
                                <h1 className='line-clamp-1 font-semibold text-lg'>{trip.title}</h1>
                                <p className='text-sm line-clamp-2 mb-2'>{trip.description}</p>
                                <div className='text-sm mb-2'>{trip.startDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})} - {trip.endDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                            </Card>
                            </Link>))}
                        </div>
                    </div>
                }
            </div>

            <div>
                {
                    sharedTrips.length > 0 && (
                        <div>
                            <h2 className='text-xl font-semibold mb-4'>Shared with You</h2>
                            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {sharedTrips.map((sharedTrip, key) => (<Link key={key} href={`/trips/${sharedTrip.tripId}`}>
                                <Card className='hover:shadow-md transistion-shadow duration-200'>
                                    <h1 className='line-clamp-1 font-semibold text-lg'>{sharedTrip.trip.title}</h1>
                                    <p className='text-sm line-clamp-2 mb-2'>{sharedTrip.trip.description}</p>
                                    <div className='text-sm mb-2'>{sharedTrip.trip.startDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})} - {sharedTrip.trip.endDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                                </Card>
                                </Link>))}
                            </div>
                        </div>
                    )
                }
            </div>

        </div>
    )
}