import { IconButton } from '@mui/material';
import { AiTwotoneLike } from 'react-icons/ai';

import { AllFlatTypes } from '@/datas/flatTypes';

import { Notification } from '@/types/notification';

export const LikeActivityCard = ({
  notification,
}: {
  notification: Notification;
}) => {
  const flatType = AllFlatTypes.find(
    (i) => i.id === notification.listing?.flatTypes[0]
  );

  return (
    <div>
      <div className=''>
        <div className=' rounded-xl bg-red-50 p-5'>
          <div className='flex '>
            <div className='flex-grow'>
              <h3>
                {flatType?.label} Flat for sale in{' '}
                {notification.listing?.flatCity},{' '}
                {notification.listing?.flatCountry}
              </h3>
            </div>
            {/* //!FUTURE - flat cost */}
            {/* <div>
              <span className=' text-secondary-main font-semibold'>
                $60,000
              </span>
            </div> */}
          </div>

          <div className='flex  gap-3 '>
            <div className='flex  w-8  rounded-full'>
              <IconButton className=' relative top-[-11px]'>
                <AiTwotoneLike className=' text-primary-main' />
              </IconButton>
            </div>
            <div className=''>
              <h2 className='text-sm font-semibold'>
                {notification.profile?.firstName}
                <strong className='text-secondary-main ml-1'>Liked</strong> Your
                Flat
              </h2>

              <div className='flex items-center'>
                <p className='text-xs text-gray-500'>
                  {new Date(notification.createdAt).toLocaleString('en-US')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
