'use client'

import { Location } from '@/app/generated/prisma';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import React from 'react'

interface MapProps {
    itineraries: Location[];
}
export default function MapProps({itineraries}: MapProps) {

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) {
    return <div>Loading Map...</div>
  }

  if (loadError) {
    return <div>Error Loading Map</div>
  }

  const center = itineraries.length > 0 ? { lat: itineraries[0].lat, lng: itineraries[0].lng} : {lat: 0, lng: 0};

  return (
    <div className={`rounded-xl shadow-lg h-144 overflow-hidden ${itineraries.length === 0 ? 'flex justify-center items-center' : ''}`}>
      <GoogleMap 
        mapContainerStyle={{width: "100%", height: "100%"}}
        zoom={12}
        center={center}
        options={{
            cameraControl: false,
        }}
        >
            {itineraries.map((location, key) => (
                <Marker key={key}
                position={{lat: location.lat, lng: location.lng}}
                title={location.locationTitle}
                // icon={{
                //     scaledSize: new google.maps.Size(40,40),
                //     url: "/destination.png"
                // }}
                />
            )
            )}
        </GoogleMap>
    </div>
  )
}
