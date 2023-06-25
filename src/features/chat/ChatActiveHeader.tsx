/* eslint-disable @next/next/no-img-element */
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';

import { PROFILES_BUCKET, storage } from '@/lib/client-old';
import useResponsive from '@/hooks/useResponsive';

export default function ChatActiveHeader({ user }: { user? }) {
  const chatUserAvatar = storage.getFilePreview(
    PROFILES_BUCKET,
    user?.profilePicture
  );

  // last activity
  const lastActivityDate = user?.lastActivity
    ? new Date(user.lastActivity)
    : null;
  const differenceInMinutes = lastActivityDate
    ? (new Date().getTime() - lastActivityDate!.getTime()) / (1000 * 60)
    : null;

  const userActive =
    lastActivityDate && differenceInMinutes && differenceInMinutes < 1;
  const { push } = useRouter();
  const handleBackClick = () => push('/messages');

  const isMediumScreen = useResponsive('down', 'lg');

  const fullName = `${user?.firstName} ${user?.lastName}`;
  return (
    <div className='flex items-center border-b border-gray-200 p-4'>
      {isMediumScreen && (
        <IconButton className='mr-2' onClick={handleBackClick}>
          <MdOutlineArrowBack />
        </IconButton>
      )}
      <div className='bg-primary-light relative inline-flex h-10 w-10 items-center justify-center rounded-full'>
        {user?.profilePicture ? (
          <img
            src={chatUserAvatar.href}
            alt='Avatar'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full'
          />
        ) : (
          <span className='text-md font-bold uppercase text-white'>
            {`${user?.firstName?.[0].toUpperCase()}${user?.lastName?.[0].toUpperCase()}`}
          </span>
        )}
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
            userActive ? 'bg-green-500' : 'bg-gray-500'
          }`}
        />
      </div>
      <h2 className='ml-4 font-bold'>{fullName}</h2>
    </div>
  );
}
