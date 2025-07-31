'use client'

import Card from '@/components/utils/Card';
import { MapPin } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Globe, {GlobeMethods} from 'react-globe.gl'


export interface TransformedLocation {
    lat: number;
    lng: number;
    name: string;
    country: string;
}

export default function GlobePage() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined)

    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 1;
        }
    })

    const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set())
    const [locations, setLocations] = useState<TransformedLocation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch("/api/trips")
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("API error:", errorText);
                    return;
                }
                const data = await response.json()
                setLocations(data)
                const countries = new Set<string>(data.map((loc: TransformedLocation) => loc.country))

                setVisitedCountries(countries)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLocations()
    }, [])
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-4 py-12'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-center text-4xl font-bold mb-12'>Your Travels</h1>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
                    <div className='lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden'>
                        <div className='p-6'>
                            <div className='h-[600px] w-full relative'>
                                {isLoading
                                ?  <div className='flex items-center justify-center h-full'>
                                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                                </div>
                                :<Globe
                                    ref={globeRef}
                                    globeImageUrl={"//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"}
                                    bumpImageUrl={"//unpkg.com/three-globe/example/img/earth-topology.png"}
                                    backgroundColor='rgba(0,0,0,0)'
                                    pointColor={() => '#FF4040'}
                                    pointLabel="name"
                                    pointRadius={0.5}
                                    pointAltitude={0.05}
                                    pointsMerge={true}
                                    pointsData={locations}
                                    width={800}
                                    height={600}
                                />}
                            </div>
                        </div>
                    </div>

                    <div className='lg:col-span-1'> 
                        <Card className='sticky top-8 border-none'>

                            {isLoading
                                ?  <div className='flex items-center justify-center h-full'>
                                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                                </div>
                                :   <div className='space-y-4'>
                                    <div className='bg-blue-50 p-4 rounded-lg'>
                                        <p className='text-sm text-blue-800'>You have visited <span className='font-bold'>{visitedCountries.size}</span> countries</p>              
                                    </div>

                                    <div className='space-y-2 max-h-[500px] overflow-y-auto pr-2'>
                                        {Array.from(visitedCountries).sort().map((country, key) => (
                                            <div key={key} className='flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100'>
                                                <MapPin className='h-4 w-4 text-red-500'/>
                                                <span className='font-medium'>{country}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
