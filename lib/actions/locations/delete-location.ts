'use server'

import { auth } from "@/auth";
import { prisma } from '../../prisma';

export default async function deleteLocation(locationId: string) {
    const session = await auth()
    if(!session) {
    throw new Error("Not authenticated");
    }

    await prisma.location.delete({where: {
            id: locationId
        }})
}