import { divIcon } from 'leaflet';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { MapFlatCard } from '@/features/FlatCard/MapFlatCard';

import { Listing } from '@/types/listing';

export default function ListingsMapView({
  listings = [],
}: {
  listings: Listing[];
}) {
  // ! FUTURE UPDAte: center cord according to user prefs location
  const kathmanduCoords: any = [27.7172, 85.324]; // Kathmandu coordinates

  return (
    <div>
      <MapContainer
        center={kathmanduCoords}
        zoom={13}
        style={{ height: 'calc(100vh - 70px)', width: '100%' }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        {listings.map((item, index) => {
          // ignore listing on map, if no exact flat geo
          if (!item.flatGeo || (item.flatGeo && item.flatGeo.length !== 2))
            return <></>;
          return (
            <Marker
              key={index}
              position={item.flatGeo as any}
              icon={divIcon({
                className: 'custom-icon',
                html: `<div class="py-2 text-center bg-white rounded-[20px] !scale-[1.2] border border-solid border-red-200"><div class="icon-label text-primary-main font-semibold">${`${
                  item?.costs?.currency
                } ${
                  item?.costs?.monthlyCost || item?.costs?.purchaseCost
                }`}</div></div>`,
                iconSize: [80, 40],
              })}
            >
              <Popup>
                <MapFlatCard data={item} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
