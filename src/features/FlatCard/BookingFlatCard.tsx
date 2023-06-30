import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { timeAgo } from '@/lib/date';
import logger from '@/lib/logger';

import { AllFlatTypes } from '@/datas/flatTypes';

import { Iroom } from '@/store/flatStore';
import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import { ImageCard } from '@/features/my-flats/cards/ImageCard';

import { Listing } from '@/types/listing';

export const BookingFlatCard = ({ data }: { data }) => {
  const listing: Listing = data.listing;

  const { user } = useAuthStore();
  const { openSnackbar } = useSnackbarStore();

  // ! FUTURE: carousel for gallery
  const [gallery, setGallery] = useState<Iroom[]>([]);

  useEffect(() => {
    const decodeGallery = () => {
      try {
        const _gallery: Iroom[] = JSON.parse(listing?.gallery.toString());
        setGallery(_gallery);
      } catch (error) {
        logger('Listing Gallery load failed');
      }
    };
    decodeGallery();
  }, [data]);

  const flatType = AllFlatTypes.find((i) => i.id === listing?.flatTypes[0]);

  const flatImageID =
    gallery?.length > 0 && gallery[0].photos.length > 0
      ? gallery[0].photos[0]
      : '';

  return (
    <>
      <div className='  z-30 flex min-w-[200px] cursor-pointer flex-col overflow-hidden rounded-md shadow-md'>
        <div className='relative w-full object-cover p-2'>
          <Link href={`/flats/${listing.$id}`}>
            <div className='h-[200px] overflow-hidden'>
              <ImageCard fileID={flatImageID} />
            </div>
          </Link>
        </div>
        <div className='flex w-full p-2'>
          <h3 className='flex-grow text-lg font-medium text-blue-900'>
            <Link href={`/flats/${listing.$id}`}>
              {flatType?.label} Flat for sale in {listing?.flatCity},{' '}
              {listing?.flatCountry}
            </Link>
          </h3>
          <h4 className=' text-sm text-blue-600'>
            {timeAgo(new Date(listing.createdAt), { suffix: true })}
          </h4>
        </div>
        <div className='flex flex-wrap gap-2 p-1 '>
          {/* //!FUTURE: fetch nearyby top points using geo */}
          {listing?.bathroom ? (
            <span className='hover:bg-primary-main rounded-full bg-black p-1.5 px-2 text-xs text-white'>
              {listing?.bathroom} Bathrooms
            </span>
          ) : (
            ''
          )}
          {listing?.room ? (
            <span className='hover:bg-primary-main rounded-full bg-black p-1.5 px-2 text-xs text-white'>
              {listing?.room} Large rooms
            </span>
          ) : (
            ''
          )}
          {/* <span className='hover:bg-primary-main rounded-full bg-black p-1.5 px-2 text-xs text-white'>
            Near By City Hospital
          </span> */}
        </div>
        <div className='flex w-full p-2 text-lg font-semibold selection:justify-between'>
          <div className='flex-grow'>Booked Till</div>
          <div className='text-secondary-main'>
            {new Date(data.endDate).toLocaleString('en-US')}
          </div>
        </div>
      </div>
    </>
  );
};
