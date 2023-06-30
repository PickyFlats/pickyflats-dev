import { Button, Divider, IconButton } from '@mui/material';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';

import { updateListingById } from '@/database/listing';
import { AllFlatTypes } from '@/datas/flatTypes';

import Modal from '@/components/Modal';

import { Iroom } from '@/store/flatStore';
import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import ReserveModal from '@/features/listings/ReserveModal';
import { ImageCard } from '@/features/my-flats/cards/ImageCard';
import RequestForTourModal from '@/features/tour-request/RequestForTourModal';

import { Listing } from '@/types/listing';

export const MapFlatCard = ({ data }: { data: Listing }) => {
  const { user } = useAuthStore();
  const { openSnackbar } = useSnackbarStore();
  const [inSavedList, setInSavedList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [tourModal, setTourModal] = useState(false);
  const [reserveModal, setReserveModal] = useState(false);

  // ! FUTURE: carousel for gallery
  const [gallery, setGallery] = useState<Iroom[]>([]);

  useEffect(() => {
    if (!user) return;
    setInSavedList(data?.saved_by.includes(user?.$id));
    setIsLiked(data?.liked_by.includes(user?.$id));
  }, [user]);

  useEffect(() => {
    setGallery(data.gallery || []);
  }, [data]);

  const handleLike = async () => {
    if (!user) {
      openSnackbar('Please login to like this listing!', 'info');
      return;
    }
    const _isLiked = isLiked
      ? data?.liked_by.filter((a) => a !== user?.$id)
      : [...data!.liked_by, user!.$id];

    await updateListingById(data?.$id, { liked_by: _isLiked });
    setIsLiked(!isLiked);
  };

  const handleAddtoList = async () => {
    if (!user) {
      openSnackbar('Please login to add to list!', 'info');
      return;
    }
    const savedList = inSavedList
      ? data?.saved_by.filter((a) => a !== user?.$id)
      : [...data!.saved_by, user!.$id];

    await updateListingById(data?.$id, { saved_by: savedList });
    openSnackbar(`Flat ${inSavedList ? 'Removed from ' : 'Added to '} My List`);
    setInSavedList(!inSavedList);
  };

  const handleOpenTourModal = () => {
    if (!user) {
      openSnackbar('Please login to use this feature!', 'info');
      return;
    }
    setTourModal(true);
  };

  // workflow for reservation
  // allow user to choose and proceed even without any account
  // save reservation in localstorage until user has cleared /reserved
  // quick reservation without pickyflats account, only using phone number or email and verification code
  const handleReserveClick = () => {
    setReserveModal(true);
  };

  const flatType = AllFlatTypes.find((i) => i.id === data?.flatTypes[0]);

  const flatImageID =
    gallery?.length > 0 && gallery[0].photos.length > 0
      ? gallery[0].photos[0]
      : '';

  return (
    <>
      <div className='  z-30 flex h-[350px] min-w-[170px] cursor-pointer flex-col overflow-hidden rounded-md'>
        <div className='relative w-full object-cover'>
          <Link href={`/flats/${data.$id}`}>
            <div className='h-[200px] overflow-hidden'>
              <ImageCard fileID={flatImageID} />
            </div>
          </Link>
          <div className='absolute top-2 h-[150px] w-full p-3'>
            <div className='flex w-full'>
              <div className='flex-grow '>
                <span className='text-primary-main rounded-[15px] bg-white bg-opacity-80 p-1 px-2 pt-1.5  text-lg font-medium'>
                  Buy
                  <span className=' text-primary-light font-normal'>
                    {' '}
                    {data?.costs?.currency} {data?.costs?.monthlyCost}
                  </span>
                </span>
              </div>
              <div
                onClick={handleAddtoList}
                className={clsx(
                  ' hover:bg-primary-light text-primary-main relative top-[-3px] flex h-[30px] w-[30px]  cursor-pointer flex-col justify-center rounded-full bg-white align-middle hover:text-white',
                  inSavedList ? '!bg-primary-main text-white' : ''
                )}
              >
                <FaRegBookmark className='relative m-auto ' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full p-2'>
          <h3 className='flex-grow text-base font-medium text-blue-900'>
            <Link href={`/flats/${data.$id}`}>
              {flatType?.label} Flat{' '}
              {data?.purpose === 'rent' ? 'on rent' : 'for sale'} in{' '}
              {data?.flatCity}, {data?.flatCountry}
            </Link>
          </h3>
        </div>
        <div className='m-auto w-[96%]'>
          <Divider />
        </div>
        <div className='mt-2 flex flex-wrap gap-2 p-1'>
          {/* //!FUTURE: fetch nearyby top points using geo */}
          {data?.bathroom ? (
            <span className='hover:bg-primary-main rounded-full bg-black p-1.5 px-2 text-xs text-white'>
              {data?.bathroom} Bathrooms
            </span>
          ) : (
            ''
          )}
          {data?.room ? (
            <span className='hover:bg-primary-main rounded-full bg-black p-1.5 px-2 text-xs text-white'>
              {data?.room} Large rooms
            </span>
          ) : (
            ''
          )}
          {/* <span className='hover:bg-primary-main rounded-full bg-black p-1.5 px-2 text-xs text-white'>
            Near By City Hospital
          </span> */}
        </div>
        <div className='flex-grow'></div>
        <div className='flex w-full p-2'>
          <div className='flex-grow'>
            <IconButton onClick={handleLike}>
              {isLiked ? <FcLike /> : <FcLikePlaceholder />}
            </IconButton>
            {/* //!: FUTURE Update */}
            {/* <IconButton>
              <RiShareForwardFill />
            </IconButton> */}
          </div>
          <div className='space-x-2'>
            {/* //!: FUTURE - reservatio feature */}
            {/* <Button
              variant='contained'
              className='bg-secondary-main !text-whtie relative top-1 h-[30px]'
              onClick={handleReserveClick} 
            >
              Reserve
            </Button> */}
            <Button
              variant='outlined'
              className='relative top-1 h-[30px]'
              onClick={handleOpenTourModal}
            >
              Request Tour
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={reserveModal} onClose={() => setReserveModal(false)}>
        <ReserveModal
          listing={data}
          listingID={data?.$id}
          onClose={() => setTourModal(false)}
        />
      </Modal>
      <Modal
        isOpen={tourModal}
        className=''
        onClose={() => setTourModal(false)}
      >
        <RequestForTourModal
          sellerID={data.listedBy}
          listingID={data?.$id}
          onClose={() => setTourModal(false)}
        />
      </Modal>
    </>
  );
};
