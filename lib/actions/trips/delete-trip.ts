'use server'

import { auth } from "@/auth";
import { prisma } from '../../prisma';

export default async function deleteTrip(tripId: string) {
    const session = await auth()
    if(!session) {
    throw new Error("Not authenticated");
    }

    await prisma.trip.delete({where: {
            id: tripId
        }})
}