import { Alert, AlertTitle, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { isEmptyArray } from '@/lib/helper';

import { fetchMyListings } from '@/database/listings';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';

import useAuthStore from '@/store/useAuthStore';
import useListingsStore from '@/store/useListingsStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import { AddFlatModal } from '@/features/my-flats/Modal/AddFlatModal';
// import VerificationRequestModal from '@/features/profileVerification/VerificationModal';
import withAuth, { WithAuthProps } from '@/hoc/withAuth';
import { MyFlatCard } from '@/pageComponents/dashboard/cards/MyFlatCard';

import { Listing } from '@/types/listing';
export default function MyFlats() {
  const {
    query: { newListing },
  } = useRouter();

  const { refreshCount } = useListingsStore();

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const { user } = useAuthStore();
  const [myFlats, setMyFlats] = useState<Listing[]>([]);
  const { openSnackbar } = useSnackbarStore();

  const fetchMyListingsData = async () => {
    try {
      const myFlats = await fetchMyListings();
      setMyFlats(myFlats);
    } catch (error) {
      openSnackbar('Failed to fetch my listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListingsData();
  }, [refreshCount]);

  const handleVerificationModal = () => {
    openSnackbar('Feature not implemented!', 'info');
    // setOpen(true);
  };

  return (
    <div className='w-full p-5'>
      <Alert severity='info' className='kdj'>
        <div className='items-start space-y-2 md:flex md:justify-between md:space-x-2'>
          <div>
            <AlertTitle>Profile Verification Required</AlertTitle>
            Create your listing now, but please note that it will be visible to
            the public only after profile verification.
          </div>
          <div className='my-auto flex md:justify-end'>
            <Button variant='contained' onClick={handleVerificationModal}>
              Start Verification
            </Button>
          </div>
        </div>
      </Alert>

      <Modal isOpen={open} className='' onClose={handleClose}>
        VerificationRequestModal
        {/* <VerificationRequestModal /> */}
      </Modal>

      <div className='flex h-9 w-full py-3'>
        <div className='flex-grow'>
          <h2 className=' text-primary-main text-2xl font-semibold'>
            My Flats
          </h2>
        </div>
        <div>
          <AddFlatModal
            openListingModal={Boolean(newListing)}
            onListingCreated={fetchMyListingsData}
          />
        </div>
      </div>

      <div>
        {loading && (
          <div className='py-4'>
            <Loader />
          </div>
        )}

        <div className='flex flex-wrap gap-9 py-9'>
          {myFlats.map((item, i) => (
            <MyFlatCard data={item} key={i} />
          ))}
          {!loading && isEmptyArray(myFlats) && (
            <div className='flex flex-col'>
              <h4 className=' text-secondary-main text-xl font-semibold'>
                No Listings Found
              </h4>
              <div>
                You have not posted any flat listings yet. Start by creating a
                new listing to showcase your flats for rent.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LayoutWrapper(props: WithAuthProps) {
  return <DashboardLayout>{props.page}</DashboardLayout>;
}

const HomePageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'all'
);
MyFlats.getLayout = function getLayout(page: React.ReactElement) {
  return <HomePageWrapper page={page} />;
};
