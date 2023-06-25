import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IoTimeSharp } from 'react-icons/io5';
import { TbMessageCircle2Filled } from 'react-icons/tb';

import { functions } from '@/lib/client-old';
import { timeAgo } from '@/lib/date';

import { createConversation } from '@/database/conversation';
import { TourRequest, updateTourRequestById } from '@/database/tourRequests';
import { AllFlatTypes } from '@/datas/flatTypes';

import useSnackbarStore from '@/store/useSnackbarStore';

export default function TourRequestCard({ data }: { data: TourRequest }) {
  const flatType = AllFlatTypes.find(
    (i) => i.id === data?.listing.flatTypes[0]
  );

  const { openSnackbar } = useSnackbarStore();
  const { push } = useRouter();
  const [processingTour, setProcessingTour] = useState(false);

  const handleMessage = async () => {
    //!FUTURE - no new creation if conv already exits
    const conversation = await createConversation({
      participants: [data.userID, data.sellerID],
      chatStarter: data.sellerID,
    });
    push(`/messages/${conversation}`);
  };

  const handleAcceptRequest = async () => {
    setProcessingTour(true);
    await updateTourRequestById(data.$id, {
      status: 'accepted',
    });
    // send email notification using cloud function

    await functions.createExecution(
      'tourAcceptNotification',
      JSON.stringify({ tourID: data.$id })
    );

    openSnackbar(
      'Tour request accepted. Please proceed with the scheduled tour.',
      'success',
      { horizontal: 'center', vertical: 'top' }
    );
  };

  return (
    <div className='flex min-h-[200px] flex-col rounded-md bg-slate-100 p-5 text-center shadow-md max-sm:w-full'>
      <div className='flex-grow'>
        <h2 className=' text-xl font-semibold'>
          {data.user.name} Has Requested For Tour
        </h2>
        <p className=' mt-3 text-sm text-[#6f7174]'>{data.note}</p>
        <p className=' mt-3 text-sm text-[#6f7174]'>
          <span className='relative '>
            <IconButton>
              <IoTimeSharp />
            </IconButton>
          </span>
          {timeAgo(new Date(data.$createdAt), { suffix: true })}
        </p>
      </div>

      <div className='my-3 h-auto w-full rounded-lg  bg-slate-900 py-3 text-black'>
        <h2 className=' py-3 font-semibold text-white'>
          <Link href={`/flats/${data.listing.$id}`}>
            {flatType?.label} Flat for sale in {data.listing?.flatCity},{' '}
            {data?.listing?.flatCountry}
          </Link>
        </h2>
        <div className=' flex px-3 text-left '>
          <div className='flex-grow'>
            <span className='rounded-xl border-[2px] bg-black px-3 py-1 text-sm text-white'>
              {flatType?.label}
            </span>
            {/* //!FUTURE -  */}
            {/* <span className='rounded-xl border-[2px] bg-black px-3 py-1 text-sm text-white'>
              luxury flat
            </span> */}
          </div>
          <div>
            <span className='text-lg font-bold text-white'>
              {data?.listing?.costs?.currency}{' '}
              {data?.listing?.costs?.monthlyCost}
            </span>
          </div>
        </div>
      </div>
      <div className='flex'>
        <div className='flex-grow text-left'>
          <Button
            onClick={handleMessage}
            startIcon={<TbMessageCircle2Filled className=' mt-[-4px]' />}
          >
            Message
          </Button>
        </div>
        <Button disabled={processingTour} onClick={handleAcceptRequest}>
          Accept Request
        </Button>
      </div>
    </div>
  );
}
