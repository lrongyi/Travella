import { auth } from "@/auth";
import { CalendarDays, MapPinCheck, Users } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth();

  if (session) {
    redirect("/trips")
  }

  return (
    <div className="flex flex-col justify-center items-center p-16">
      <Image src={"/destination.png"} width={100} height={100} alt="Logo" className="mb-4"/> 
      <h1 className="font-bold text-5xl mt-4 mb-8">Travella</h1>
      <p className="mb-12 text-xl text-gray-500 max-w-xl text-center">
        Easily organize your next adventure in one streamlined app. Collaborate with friends, invite fellow travelers, and stay on top of every step of your journey.
      </p>

      <div className="grid grid-cols-3 gap-16 text-center mt-16">
        <div className="p-4 shadow-lg rounded-lg flex flex-col items-center justify-center border border-gray-100">
          <CalendarDays className="mt-4 text-red-400" size={32}/>
          <h2 className="text-2xl font-semibold mt-4 mb-4">Itinerary Management</h2>
          <p className="text-lg text-gray-500 mb-2">Build and customize your full travel schedule—activities, transport, meals, and more.</p>
        </div>

        <div className="p-4 shadow-lg rounded-lg flex flex-col items-center justify-center border border-gray-100">
          <Users className="mt-4 text-green-400" size={32}/>
          <h2 className="text-2xl font-semibold mt-4 mb-4">Invite Collaborators</h2>
          <p className="text-lg text-gray-500 mb-2">Plan together by inviting friends and co-travelers to contribute to your trip details.</p>
        </div>

        <div className="p-4 shadow-lg rounded-lg flex flex-col items-center justify-center border border-gray-100">
          <MapPinCheck className="mt-4 text-blue-400" size={32}/>
          <h2 className="text-2xl font-semibold mt-4 mb-4">Location-Based Planning</h2>
          <p className="text-lg text-gray-500 mb-2">Plan smarter with location-aware itineraries. Organize your activities by place, time, and proximity</p>
        </div>
      </div>
    </div>
  );
}
