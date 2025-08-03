import React, { useState } from 'react';
import { TripWithLocation } from '../TripDetail';
import NewLocationButton from '@/components/utils/NewLocationButton';
import Card from '@/components/utils/Card';
import { Pencil, Trash } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import deleteLocation from '@/lib/actions/locations/delete-location';
import EditingLocation from './EditingLocation';
import { Location } from '@/prisma/generated/prisma';


interface ItineraryProps {
  trip: TripWithLocation
}

export default function Itinerary({ trip }: ItineraryProps) {
  const [dateSelected, setDateSelected] = useState(new Date(trip.startDate));
  const [locations, setLocations] = useState(trip.locations);
  const [editingLocation, setEditingLocation] = useState<TripWithLocation['locations'][0] | null>(null);

  const startOfDay = new Date(dateSelected);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(dateSelected);
  endOfDay.setHours(23, 59, 59, 999);

  const filteredLocations = locations.filter((loc: Location) => {
    const arrival = new Date(loc.arrivalTime);
    return arrival >= startOfDay && arrival <= endOfDay;
  });

  const sortedLocations = [...filteredLocations].sort((a, b) =>
    new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
  );

  const handleDelete = async (locationId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this location?');
    if (confirmed) {
      setLocations((prev: Location[]) => prev.filter(loc => loc.id !== locationId));

      try {
        await deleteLocation(locationId);
      } catch (error) {
        console.error('Failed to delete location:', error);
        setLocations(trip.locations);
      }
    }
  };

  const handleEdit = async (locationId: string) => {
    const loc = locations.find((l: Location) => l.id === locationId);
    if (loc) setEditingLocation(loc);
  }

  const handleSave = (updatedLocation: TripWithLocation['locations'][0]) => {
    setLocations((prev: Location[]) =>
      prev.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc)
    );
    setEditingLocation(null);
  };

  return (
    <>
      {editingLocation && (
        <EditingLocation location={editingLocation} trip={trip} onClose={() => setEditingLocation(null)} onSave={handleSave}/>
      )}

      {locations.length === 0 ? (
        <div className="text-center p-4 items-center flex flex-col gap-4">
          <p>This trip currently has no locations planned.</p>
          <NewLocationButton trip={trip} />
        </div>
      ) : (
        <div className="flex items-center flex-col space-y-8">
          <div className="rounded-2xl shadow p-4">
            <DayPicker
              mode="single"
              selected={dateSelected}
              onSelect={setDateSelected}
              classNames={{
                selected: 'bg-red-500 font-bold rounded-full text-white',
                today: '',
                disabled: 'opacity-0',
              }}
              showOutsideDays
              fixedWeeks
              startMonth={trip.startDate}
              endMonth={trip.endDate}
              required
              disabled={{ before: trip.startDate, after: trip.endDate }}
            />
          </div>
          <div className="space-y-4 w-full">
            {sortedLocations.map((location) => (
              <Card key={location.id} className="border-none">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h1>{location.icon}</h1>
                    <div className="space-y-2">
                      <h1 className="font-bold text-lg">{location.locationTitle}</h1>
                      <h2 className="text-gray-500">
                        {new Date(location.arrivalTime).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                        })}
                        ,{' '}
                        {new Date(location.arrivalTime).toLocaleTimeString('en-GB', {hour12: false, hour:'2-digit', minute:'2-digit'})}
                      </h2>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Pencil 
                      className='text-gray-500 hover:cursor-pointer'
                      onClick={() => handleEdit(location.id)}
                    />
                    <Trash
                      className="text-red-400 hover:cursor-pointer"
                      onClick={() => handleDelete(location.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
