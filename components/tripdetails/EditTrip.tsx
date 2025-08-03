'use client'

import { UploadButton, UploadDropzone } from '@/lib/upload-thing';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useTransition } from 'react'
import { DateRange, DayPicker } from 'react-day-picker';
import { TripWithLocation } from './TripDetail';
import { editTrip } from '@/lib/actions/trips/edit-trip';
import { Location, User } from '@/prisma/generated/prisma';

interface EditTripProps {
    trip: TripWithLocation,
    onClose: () => void,
}

export default function EditTrip({trip, onClose}: EditTripProps) {


    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState<string|null>(trip.imageUrl);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({from: trip.startDate, to: trip.endDate});

    const contributorIds = trip.contributors.map((contrib: User) => contrib.email)

    const [contributors, setContributors] = useState<string[]>(contributorIds);
    const [contributorInput, setContributorInput] = useState('');

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    return (
        <div className='fixed inset-0 z-30 bg-black/75 h-full mx-auto flex flex-col items-center justify-center'>
            <div className='w-8/10 p-8 rounded-2xl shadow bg-white'>
                <div className='relative'> 
                    <h1 className='text-center font-bold text-black text-3xl mb-6'>
                        Edit Trip
                    </h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 hover:cursor-pointer text-xl absolute top-0 right-0"
                        aria-label="Close"
                    >
                        <X />
                    </button>
                </div>

                <form className='space-y-6 w-full'
                    action={(formData: FormData) => {
                        if (!dateRange?.from || !dateRange?.to) {
                            alert('Please select a date range.');
                            return;
                        }
                        const from = new Date(dateRange.from.toDateString());
                        const to = new Date(dateRange.to.toDateString());

                        const invalidLocation = trip.locations.find((location: Location) => {
                            const arrivalDate = new Date(new Date(location.arrivalTime).toDateString());
                            return arrivalDate < from || arrivalDate > to;
                        });

                        if (invalidLocation) {
                            alert('One or more locations have arrival dates outside the selected date range.\nPlease delete them before editing the dates of your trip.');
                            return
                        }

                        if (imageUrl) {
                            formData.append("imageUrl", imageUrl)
                        }
                        
                        startTransition(async () => {
                            await editTrip(formData, trip.id)
                        });
                    }}>

                    <div className='flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch lg:justify-around'>
                        <div className='space-y-6 w-3/10'>
                            <div>
                                <label className='block font-medium mb-1 text-black'>Title</label>
                                <input type="text" name='title' defaultValue={trip.title} className='text-black w-full border border-black px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500' required/>
                            </div>
                            
                            <div>
                                <label className='block font-medium mb-1 text-black'>Description</label>
                                <textarea name='description' defaultValue={trip.description} className='text-black w-full h-36 border border-black px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500' style={{resize: 'none'}} required/>
                            </div>

                            
                            <div className='w-full mb-4 rounded-md h-48 overflow-hidden border border-black shadow flex justify-center items-center'>
                                {imageUrl ? (
                                    
                                        <Image src={imageUrl} alt="Upload Error" width={300} height={100} className='w-full h-full object-cover'/>
                                    
                                ) : (
                                    <UploadDropzone 
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0].ufsUrl) {
                                                setImageUrl(res[0].ufsUrl);
                                            }
                                        }}

                                        onUploadError={(error) => {
                                            console.error("Upload error: ", error)
                                        }}

                                        className='w-full border-none'
                                    />
                                )
                                }
                            
                            </div>

                            

                            <UploadButton 
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res && res[0].ufsUrl) {
                                        setImageUrl(res[0].ufsUrl);
                                    }
                                }}

                                onUploadError={(error) => {
                                    console.error("Upload error: ", error)
                                }}

                                className={imageUrl ? '' : 'hidden'}
                            />

                            
                        </div>
                        
                        <div className='space-y-6'>
                            <DayPicker 
                                fixedWeeks
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                defaultMonth={trip.startDate}
                                mode='range'
                                captionLayout='dropdown-years'
                                classNames={{
                                    selected: 'bg-blue-500 font-bold rounded-full text-white',
                                    today: '',
                                    range_start: 'text-black',
                                    range_middle: 'bg-blue-500',
                                    range_end: 'bg-blue-500',
                                    chevron: 'fill-blue-500',
                                }}
                            />        

                            <div className='flex gap-8'>
                                <div>
                                    <label className="block font-medium mb-1 text-black">Contributor Gmails</label>

                                    <div className="flex gap-2">
                                        <input
                                        type="email"
                                        className="text-black border border-black px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={contributorInput}
                                        onChange={(e) => setContributorInput(e.target.value)}
                                        />
                                        <button
                                        type="button"
                                        onClick={() => {
                                            if (contributorInput && gmailRegex.test(contributorInput) && !contributors.includes(contributorInput)) {
                                            setContributors((prev) => [...prev, contributorInput]);
                                            setContributorInput('');
                                            }
                                        }}
                                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 hover:cursor-pointer"
                                        disabled={!gmailRegex.test(contributorInput) || contributors.includes(contributorInput)}
                                        >
                                        Add
                                        </button>
                                    </div>
                                    {contributorInput && !gmailRegex.test(contributorInput) && (
                                        <p className="text-red-500 text-sm mt-1">Please enter a valid Gmail address.</p>
                                    )}
                                </div>
                                
                                <div className="mt-2 space-y-2 max-h-28 overflow-y-auto w-full">
                                    {contributors.map((email, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
                                    >
                                        <span className="text-sm text-black">{email}</span>
                                        <button
                                        type="button"
                                        onClick={() =>
                                            setContributors((prev) => prev.filter((e) => e !== email))
                                        }
                                        className="text-red-500 text-sm hover:underline"
                                        >
                                        Remove
                                        </button>
                                    </div>
                                    ))}
                                </div>

                                <input type="hidden" name="contributors" value={contributors.join(',')} />
                            </div>

                        </div>
                        

                        <input
                            type="hidden"
                            name="startDate"
                            value={
                                dateRange?.from 
                                ? `${dateRange.from.getFullYear()}-${String(dateRange.from.getMonth() + 1).padStart(2, '0')}-${String(dateRange.from.getDate()).padStart(2, '0')}`
                                : ''
                            }
                        />

                        <input
                            type="hidden"
                            name="endDate"
                            value={
                                dateRange?.to 
                                ? `${dateRange.to.getFullYear()}-${String(dateRange.to.getMonth() + 1).padStart(2, '0')}-${String(dateRange.to.getDate()).padStart(2, '0')}`
                                : ''
                            }
                        />
                    </div>
                    

                    <div className="flex justify-center mt-16">
                        <button
                            className="w-1/2 text-white bg-black p-4 rounded-xl text-lg cursor-pointer hover:bg-gray-500"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
