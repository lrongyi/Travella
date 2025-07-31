import React from 'react'
import NewLocationClient from '@/components/tripdetails/NewLocation'
import { prisma } from '@/lib/prisma'

export default async function NewLocation({params}: {params: Promise<{tripId: string}>}) {

  const trip = await prisma.trip.findUnique({
    where: { id: (await params).tripId}
  })

  if (!trip) {
    return <div>Trip not found</div>
  }

  return <NewLocationClient trip={trip} />
}
