import { auth } from '@/auth';
import TripDetailClient, { TripWithLocation } from '@/components/tripdetails/TripDetail';
import { prisma } from '@/lib/prisma';
import React from 'react'

export default async function TripDetail({params} : {params: Promise<{tripId: string}>;}) {

  const {tripId} = await params
  const session = await auth()

  if (!session) {
    return <div>Please sign in</div>
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        {userId: session.user?.id},
        {contributors: { some: {userId: session.user?.id}}}
      ]
    }, 
    include: {
      locations: true, 
    }
  })

  if (!trip) {
    return <div>Trip not found</div>
  }

  const contributors = await prisma.contributorsToTrip.findMany({
    where: {
      tripId: tripId
    },
    include: {
      contributor: true
    }
  })

  const tripWithContributors = {
    ...trip, 
    contributors: contributors.map((c) => c.contributor)
  }

  return (
    <TripDetailClient trip={tripWithContributors as TripWithLocation} />
  )
}
