'use server'

import { auth } from '@/auth'
import { prisma } from '../../prisma';
import { redirect } from 'next/navigation';

export async function editTrip(formData: FormData, tripId: string) {

  const session = await auth()
  if (!session || !session.user?.id) {
      throw new Error("User not authenticated")
  }
  const userId = session.user.id

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();
  const contributors = formData.get("contributors")?.toString() || "";

  if (!title || !description || !startDateStr || !endDateStr) {
    throw new Error("Missing Fields")
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.update({
      where: {
        id: tripId
      },
      data: {
          title, 
          description,
          imageUrl,
          startDate,
          endDate,
          userId
      }
    })

    const emails = contributors.split(',').map(email => email.trim()).filter(email => email.endsWith("@gmail.com"))

    for (const email of emails) {
      const user = await tx.user.findUnique({where: {email}})

      if (user) {
        const existingContributor = await tx.contributorsToTrip.findFirst({
            where: {
                userId: user.id,
                tripId: tripId
            }
        })

        if (!existingContributor) {
            await tx.contributorsToTrip.create({
            data: {
                tripId: trip.id,
                userId: user.id
            }
            })
        }
      }
    }
  })

  redirect(`/trips/${tripId}`);
}
