'use client'

import { Calendar, MapPin } from 'lucide-react'
import { DateRange, DayPicker, rangeIncludesDate } from 'react-day-picker';
import React, { useState } from 'react'
import { TripWithLocation } from '../TripDetail';
import MapSummary from './MapSummary';
import NewLocationButton from '../../utils/NewLocationButton';

interface OverviewProps {
    startDate: Date;
    endDate: Date;
    trip: TripWithLocation
}

export default function Overview({ startDate, endDate, trip}: OverviewProps) {

  const [range, setRange] = useState<DateRange>({from: startDate, to: endDate})
  return (
    <>
        <div>
            <p className='text-lg leading-relaxed mb-4 text-gray-700'>{trip.description}</p>
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
                <div className='flex items-start'> 
                    <Calendar className='h-6 w-6 mr-3 text-red-500'/>
                    <div>
                        <p className='font-medium text-gray-700'>{Math.round((endDate.getTime() - startDate.getTime()))/ (1000 * 60 * 60 * 24)} Days</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl shadow-lg w-fit">
                <DayPicker
                    modifiers={{
                        selected: range,
                        range_start: range.from,
                        range_end: range.to,
                        range_middle: (date: Date) => rangeIncludesDate(range, date)
                    }}
                    fixedWeeks
                    startMonth={startDate}
                    endMonth={endDate}
                    classNames={{
                        range_start: 'bg-red-300'
                    }}
                />
                </div>
            </div>

            <div className='space-y-4'>
                <div className='flex items-start'>
                    <MapPin className='h-6 w-6 mr-3 text-blue-500'/>
                    <div>
                        <p className='font-medium text-gray-700'>{trip.locations.length} {trip.locations.length === 1 ? 'Location' : 'Locations'} Planned</p>
                    </div>
                </div>
                <div className={`rounded-xl shadow-lg w-96 h-96 overflow-hidden ${trip.locations.length === 0 ? 'flex justify-center items-center' : ''}`}>
                    {
                        trip.locations.length === 0
                        ? <div className='text-center p-4 items-center flex flex-col gap-4'>
                            <p>Add locations to view them on the map.</p>
                            <NewLocationButton trip={trip}/>
                        </div>
                        : <MapSummary itineraries={trip.locations}/>
                    }
                </div>
            </div>
        </div>
    </>
    
  )
}
