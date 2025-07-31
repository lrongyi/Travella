'use server'

import { auth } from '@/auth'
import { prisma } from '../../prisma';
import { redirect } from 'next/navigation';

async function geocodeAddress(address: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);

    const data = await response.json()
    const {lat, lng} = data.results[0].geometry.location;
    return {lat, lng}
}

export default async function addLocation(formData: FormData, tripId: string) {
  const session = await auth()
  
  if(!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get('address')?.toString()
  if (!address) {
    throw new Error("Missing address");
  }

  const {lat, lng} = await geocodeAddress(address)


  const icon = formData.get('icon')?.toString() 
  if (!icon) {
    throw new Error("Missing icon");
  }

  const arrivalTimeStr = formData.get('arrivalTime')?.toString()
  if (!arrivalTimeStr) {
    throw new Error("Missing arrivalTime");
  }

  const arrivalTime = new Date(arrivalTimeStr)

  await prisma.location.create({
    data: {
        locationTitle: address,
        lat,
        lng,
        tripId,
        icon,
        arrivalTime
    }
  });

  redirect(`/trips/${tripId}`)
}
