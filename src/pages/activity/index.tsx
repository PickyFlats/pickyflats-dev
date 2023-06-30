/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { getNotificationByUserID } from '@/database/notification';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Loader from '@/components/Loader';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import withAuth, { WithAuthProps } from '@/hoc/withAuth';
import { CommentActivityCard } from '@/pageComponents/activities/cards/CommentActivityCard';
import { LikeActivityCard } from '@/pageComponents/activities/cards/LikeActivityCard';

import { Notification } from '@/types/notification';

//!FUTURE
// const Acitivities = [
//   {
//     id: 1,
//     title: 'New Order',
//     description: 'New Order has been placed by customer',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     type: 'order',
//     status: 'pending',
//   },
//   {
//     id: 2,
//     title: 'New Order',
//     description: 'New Order has been placed by customer',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     type: 'order',
//     status: 'pending',
//   },
//   {
//     id: 3,
//     title: 'New Order',
//     description: 'New Order has been placed by customer',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     type: 'order',
//     status: 'pending',
//   },
//   {
//     id: 4,
//     title: 'New Order',
//     description: 'New Order has been placed by customer',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     type: 'order',
//     status: 'pending',
//   },
//   {
//     id: 5,
//     title: 'New Order',
//     description: 'New Order has been placed by customer',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     type: 'order',
//     status: 'pending',
//   },
// ];

// const reviews = [
//   {
//     id: 1,
//     name: 'John Doe',
//     comment:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     rating: 4,
//   },
//   {
//     id: 2,
//     name: 'John Doe',
//     comment:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     rating: 4,
//   },
//   {
//     id: 3,
//     name: 'John Doe',
//     comment:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
//     date: '2021-10-10',
//     time: '10:00 AM',
//     rating: 4,
//   },
// ];

export default function Acitivity() {
  const { user } = useAuthStore();
  const { openSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchMyActiviesData = async () => {
    try {
      const _notifications = await getNotificationByUserID(user?.$id);
      _notifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(_notifications);
    } catch (error) {
      openSnackbar('Activities load failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyActiviesData();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='cursor-pointer text-2xl  font-semibold'>Activities</h1>

      <div className='mt-4 flex flex-col gap-5'>
        {loading && <Loader />}
        {notifications.map((notification, i) => {
          if (notification.type == 'like') {
            return <LikeActivityCard notification={notification} key={i} />;
          }

          if (notification.type == 'commented') {
            return <CommentActivityCard notification={notification} key={i} />;
          }

          //!FUTURE other type notifications
          return <></>;
        })}

        {!loading && notifications.length < 1 && (
          <div className='flex flex-col'>
            <h4 className=' text-secondary-main text-xl font-semibold'>
              No notification activities
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutWrapper(props: WithAuthProps) {
  return <DashboardLayout>{props.page}</DashboardLayout>;
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'all'
);
Acitivity.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
