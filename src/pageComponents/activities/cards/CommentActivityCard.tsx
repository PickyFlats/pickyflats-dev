import { IconButton } from '@mui/material';
import { FcComments } from 'react-icons/fc';

import { AllFlatTypes } from '@/datas/flatTypes';

import { Notification } from '@/types/notification';

export const CommentActivityCard = ({
  notification,
}: {
  notification: Notification;
}) => {
  const flatType = AllFlatTypes.find(
    (i) => i.id === notification.listing?.flatTypes[0]
  );

  const user = notification?.comment?.user;
  return (
    <div>
      <div className=''>
        <div className=' rounded-xl bg-red-50 p-5'>
          <div className='flex '>
            <div className='flex-grow'>
              <h3>
                {flatType?.label} Flat{' '}
                {notification.listing?.purpose === 'rent'
                  ? 'on rent'
                  : 'for sale'}{' '}
                in {notification.listing?.flatCity},{' '}
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
                <FcComments />
              </IconButton>
            </div>
            <div className=''>
              <h2 className='text-sm font-semibold'>{`${user?.firstName} ${user?.lastName}`}</h2>
              <p className='text-xs text-gray-500'>
                {notification.comment?.text}
              </p>

              <div className='flex items-center'>
                <p className='text-xs text-gray-500'>
                  {new Date(notification.createdAt).toLocaleString('en-US')}
                </p>

                {/* //! FUTURE - reply feature */}
                {/* <div className='ml-2'>
                  <button className='rounded-3xl px-3 py-1 text-xs text-blue-500'>
                    Reply
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
