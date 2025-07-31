import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
        return new NextResponse("Not Authenticated", { status: 401});
    }
    const locations = await prisma.location.findMany({
      where: {
        OR: [
          {
            trip: {
              userId: session.user?.id,
            },
          },
          {
            trip: {
              contributors: {
                some: {
                  userId: session.user?.id,
                },
              },
            },
          },
        ],
      },
      select: {
        locationTitle: true,
        lat: true,
        lng: true,
        trip: {
          select: {
            title: true,
          },
        },
      },
    });

    const transformedLocations = await Promise.all(locations.map(async (loc) => {
        const geocodeRes = await getCountryFromCoordinates(loc.lat, loc.lng)

        return {
            name: `${loc.trip.title} - ${geocodeRes.formattedAddress}`,
            lat: loc.lat,
            lng: loc.lng,
            country: geocodeRes.country
        }
    }));

    return NextResponse.json(transformedLocations);
  } catch (error) {
    return new NextResponse("Internal Error", {status: 500})
  }
}
