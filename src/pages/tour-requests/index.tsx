import React, { useEffect, useState } from 'react';

import { isEmptyArray } from '@/lib/helper';

import {
  getTourRequestsForCurrentSeller,
  TourRequest,
} from '@/database/tourRequests';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Loader from '@/components/Loader';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import withAuth, { WithAuthProps } from '@/hoc/withAuth';
import TourRequestCard from '@/pageComponents/tourRequests/TourRequestCard';

export default function TourRequestPage() {
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<TourRequest[]>([]);

  const { openSnackbar } = useSnackbarStore();

  const fetchTourRequestedListingsData = async () => {
    try {
      const requests: any = await getTourRequestsForCurrentSeller();
      setRequests(requests);
    } catch (error) {
      openSnackbar('Failed to fetch my listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourRequestedListingsData();
  }, []);

  return (
    <div>
      <div className='h-auto w-full p-5 '>
        <div className='flex-grow'>
          <h2 className=' text-primary-main text-2xl font-semibold'>
            Requests for Tour
          </h2>
        </div>

        {loading && (
          <div className='py-4'>
            <Loader />
          </div>
        )}

        <div className='grid grid-cols-4 flex-wrap gap-4 py-4 max-md:grid-cols-2 max-sm:grid-cols-1'>
          {requests
            .filter((r) => r.status === 'draft')
            .map((item, i) => {
              return <TourRequestCard key={i} data={item} />;
            })}
        </div>

        {!loading && isEmptyArray(requests) && (
          <div className='flex flex-col'>
            <div className='text-secondary-main font-medium'>
              No tour requests found. You don't have any pending tour requests
              at the moment. Please check back later.
            </div>
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
TourRequestPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
