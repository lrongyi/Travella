'use client'

import { createTrip } from '@/lib/actions/trips/create-trip'
import { UploadButton, UploadDropzone } from '@/lib/upload-thing';
import Image from 'next/image';
import React, { useState, useTransition } from 'react'
import { DateRange, DayPicker } from 'react-day-picker';

export default function NewTrip() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [contributors, setContributors] = useState<string[]>([]);
  const [contributorInput, setContributorInput] = useState('');


  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  return (
    <div className='mx-auto min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center'>
        <div className='w-8/10 p-8 rounded-2xl shadow bg-white'>
            <h1 className='text-center font-bold text-black text-3xl mb-6'>
                Create a New Trip
            </h1>

            <form className='space-y-6 w-full'
                action={(formData: FormData) => {
                    if (!dateRange?.from) {
                        alert('Please select a date range.');
                        return;
                    }
                    if (imageUrl) {
                        formData.append("imageUrl", imageUrl)
                    }
                    startTransition(() => {
                        createTrip(formData);
                    })
                }}>

                <div className='flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch lg:justify-around'>
                    <div className='space-y-6 w-3/10'>
                        <div>
                            <label className='block font-medium mb-1 text-black'>Title</label>
                            <input type="text" name='title' className='text-black w-full border border-black px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500' required/>
                        </div>
                        
                        <div>
                            <label className='block font-medium mb-1 text-black'>Description</label>
                            <textarea name='description' className='text-black w-full h-36 border border-black px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500' style={{resize: 'none'}} required/>
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
                            dateRange?.from ? dateRange.from.toISOString().split('T')[0] : ''
                        }
                    />

                    <input
                        type="hidden"
                        name="endDate"
                        value={
                            dateRange?.to ? dateRange.to.toISOString().split('T')[0] : ''
                        }
                    />
                </div>
                

                <div className="flex justify-center mt-16">
                    <button
                        className="w-1/2 text-white bg-black p-4 rounded-xl text-lg cursor-pointer hover:bg-gray-500"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create Trip"}
                    </button>
                </div>

            </form>
        </div>
    </div>
  )
}
