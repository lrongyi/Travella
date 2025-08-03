'use client'

import { Location, Trip, User } from '@/prisma/generated/prisma';
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users } from 'lucide-react'
import Overview from './overview/Overview';
import Itinerary from './itinerary/Itinerary';
import Map from './map/Map';
import NewLocationButton from '../utils/NewLocationButton';
import DeleteTripButton from '../utils/DeleteTripButton';
import EditTripButton from '../utils/EditTripButton';

export type TripWithLocation = Trip & {
    locations: Location[];
    contributors: User[];
}

interface TripDetailClientProps {
    trip: TripWithLocation;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  
  const tabs = ['Overview', 'Itinerary', 'Map'];

  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'> 
        {trip.imageUrl && 
        <div className='w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative'>
            <Image src={trip.imageUrl} alt={trip.title} className='object-cover' fill priority />
        </div>} 

        <div className='bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center'>
            <div>
                <h1 className='text-4xl font-extrabold'>{trip.title}</h1>
                <div className='flex items-center text-gray-500 mt-2'>
                    <Calendar className='h-5 w-5 mr-2'/>
                    <span className='text-lg'>
                        {trip.startDate.toLocaleDateString('en-GB')} - {trip.endDate.toLocaleDateString('en-GB')}
                    </span>
                </div>
                <div className='flex items-center text-gray-500 mt-2'>
                    <Users className='h-5 w-5 mr-2' />
                    <div className='flex flex-wrap gap-2 overflow-x-auto'>
                            {
                                trip.contributors.length === 0 
                                ? (
                                    <p className='text-lg'>No Contributors</p>
                                )
                                : (
                                    trip.contributors.map((contributor, key) => (
                                        <div key={key} className='p-2 rounded-2xl shadow bg-green-700'>
                                            <p className='text-white'>{contributor.name}</p>
                                        </div>
                                    ))
                                )
                            }
                    </div>
                </div>
            </div>

            <div className='space-y-4 lg:mt-0 mt-4'>
                <EditTripButton trip={trip}/> 
                <DeleteTripButton trip={trip}/>
            </div>

            
        </div>

        <div>

            <div className='flex justify-between'>
                <div className="flex space-x-2 p-2 bg-gray-100 rounded-t-lg w-fit">
                    {tabs.map((tab) => (
                        <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            px-4 py-2 hover:rounded-lg hover:shadow hover:transition-shadow hover:cursor-pointer
                            ${activeTab === tab ? 'bg-white shadow font-semibold rounded-lg' : 'text-gray-500 hover:bg-white'}
                        `}
                        >
                        {tab}
                        </button>
                    ))}
                </div>

        
                {activeTab === 'Itinerary' && <NewLocationButton trip={trip}/>}
            </div>

            
        
            <div className='p-6 shadow rounded-b-lg rounded-r-lg bg-white'>
                {
                activeTab === 'Overview' 
                ? <Overview startDate={trip.startDate} endDate={trip.endDate} trip={trip}/>
                : activeTab === 'Itinerary' 
                ? <Itinerary trip={trip}/>
                : <Map itineraries={trip.locations}/>
                }
            </div>


        </div>

        <div className='flex justify-center'>
            <Link href={`/trips`}>
                <div>
                    <button className='flex gap-2 bg-gray-700  text-white px-4 py-2 rounded-xl shadow cursor-pointer'>
                        <ArrowLeft/>
                        Back to Trips
                    </button>
                </div>
            </Link>
        </div>
        
    </div>
  )
}
