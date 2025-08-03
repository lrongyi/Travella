import { Location } from '@/prisma/generated/prisma';
import editLocation from '@/lib/actions/locations/edit-location';
import React, { useState, useTransition } from 'react'
import { DayPicker } from 'react-day-picker';
import TimePicker from 'react-time-picker';
import { TripWithLocation } from '../TripDetail';
import { X } from 'lucide-react';


interface EditingLocationProps {
    location: Location
    trip: TripWithLocation
    onClose: () => void
    onSave: (updatedLocation: Location) => void;
}

export default function EditingLocation({location, trip, onClose, onSave}: EditingLocationProps) {

    const [dateSelected, setDateSelected] = useState<Date>(location.arrivalTime);
    const [timeSelected, setTimeSelected] = useState<string | null>(location.arrivalTime.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }))
    const [iconSelected, setIconSelected] = useState<string>(location.icon)
    const [isPending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-30 bg-black/75 flex items-center justify-center overflow-visible w-full mx-auto">
        <div className='bg-white p-8 rounded-lg shadow-lg flex flex-col relative'>
            <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700 hover:cursor-pointer text-xl absolute top-4 right-4"
                    aria-label="Close"
                >
                    <X />
                </button>
                <h1 className='text-3xl font-bold text-center mb-6'>Editing Location</h1>
            
            <form 
            action={(formData: FormData) => {startTransition(async () => {
                const updated = await editLocation(formData, location.id);
                onSave(updated);
            })}} 
            className='space-y-6'
            >
                <div className='space-y-6 flex flex-col items-center'>
                    <div className='w-full'>

                        <label className='block text-sm font-medium text-gray-700 mb-2'>Address Name</label>
                        <input type="text" defaultValue={location.locationTitle} name="address" className='text-black w-full border border-black px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500' required />

                        <div className='w-full mt-2'>
                            <div className='grid grid-cols-5 gap-2'>
                                {['📍', '🏨', '🍽️', '🚌', '🏞️'].map((icon) => (
                                <button
                                    type="button"
                                    key={icon}
                                    className={`text-2xl p-2 rounded-lg border ${
                                    iconSelected === icon ? 'border-gray-700 bg-blue-100' : 'border-gray-300'
                                    }`}
                                    onClick={() => setIconSelected(icon)}
                                >
                                    {icon}
                                </button>
                                ))}
                            </div>
                            <input type="hidden" name="icon" value={iconSelected} />
                        </div>
                        
                    </div>

                    <div className='p-4 rounded-xl shadow w-fit'>
                        <DayPicker
                        mode='single'
                        selected={dateSelected}
                        onSelect={setDateSelected}
                        classNames={{
                            selected: 'bg-blue-500 font-bold rounded-full text-white',
                            today: '',
                            disabled: 'opacity-0'
                        }}
                        showOutsideDays
                        fixedWeeks
                        startMonth={trip.startDate}
                        endMonth={trip.endDate}
                        required
                        disabled={{before: trip.startDate, after: trip.endDate}}
                    />
                    </div>

                    <div className='shadow rounded-xl border-0 p-2 relative overflow-visible z-50'>
                        <TimePicker 
                            className="custom-time-picker"
                            onChange={setTimeSelected}
                            value={timeSelected}
                            disableClock
                            clearIcon={null}
                            closeClock={false}
                            required
                        />
                    </div>

                </div>

                <input
                    type="date"
                    name="dateValidation"
                    defaultValue={dateSelected ? dateSelected.toISOString().split('T')[0] : ''}
                    required
                    hidden
                    onInvalid={(e) => {
                        e.preventDefault();
                        alert('Please select a date.');
                    }}
                />

                <input
                    type="hidden"
                    name="arrivalTime"
                    value={
                        dateSelected && timeSelected
                        ? new Date(dateSelected.toDateString() + ' ' + timeSelected).toISOString()
                        : ''
                    }
                />

                <button className='bg-gray-700 p-2 rounded-lg w-full text-sm cursor-pointerhover:bg-gray-500 text-white hover:cursor-pointer'>{isPending ? 'Saving...' : 'Save Changes'}</button>
            </form>
        </div>
        
    </div>
  )
}
