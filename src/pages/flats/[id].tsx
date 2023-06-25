import { Button, IconButton } from '@mui/material';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { RiShareForwardFill } from 'react-icons/ri';

import logger from '@/lib/logger';

import { fetchListingById, updateListingById } from '@/database/listing';
import { createListingLikeNotification } from '@/database/notification';
import { AllFlatTypes } from '@/datas/flatTypes';

import MainLayout from '@/components/layout/MainLayout';
import Modal from '@/components/Modal';

import useAuthStore from '@/store/useAuthStore';
import useListingStore from '@/store/useListingStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import { Comment } from '@/features/Comment';
import FullListingSkeleton from '@/features/listings/FullListingSkeleton';
import ReserveModal from '@/features/listings/ReserveModal';
import { ImageCard } from '@/features/my-flats/cards/ImageCard';
import RequestForTourModal from '@/features/tour-request/RequestForTourModal';
import withAuth, { WithAuthProps } from '@/hoc/withAuth';
import { AllAmenities } from '@/pageComponents/flats/AllAmenities';
import { Costs } from '@/pageComponents/flats/Costs';
import FlatSidebar from '@/pageComponents/flats/flat/FlatSidebar';
import { GalleryModal } from '@/pageComponents/flats/GalleryModal';
import { Policies } from '@/pageComponents/flats/Policies';

import { Listing } from '@/types/listing';

const Map = dynamic(() => import('@/features/map/MapView'), {
  ssr: false,
});

export const DetailView = () => {
  const {
    query: { id },
    push,
  } = useRouter();
  const { openSnackbar } = useSnackbarStore();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<Listing>();
  const { user } = useAuthStore();

  const [tourModal, setTourModal] = useState(false);
  const [reserveModal, setReserveModal] = useState(false);

  const { setComments, gallery, setGallery } = useListingStore();

  // like/saved list

  const [inSavedList, setInSavedList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [bgImage, setBgImage] = useState('');

  const [imgType, setImgType] = useState<
    'room' | 'bathroom' | 'kitchen' | 'other' | ''
  >('');

  useEffect(() => {
    if (loading) return;
    const decodeGallery = () => {
      try {
        // const _gallery: Iroom[] = JSON.parse(listing!.gallery.toString());
        setGallery(listing?.gallery || []);
      } catch (error) {
        logger('Listing Gallery load failed');
      }
    };
    decodeGallery();

    if (!user) return;
    setInSavedList(Boolean(listing?.saved_by.includes(user?.$id)));
    setIsLiked(Boolean(listing?.liked_by.includes(user?.$id)));
  }, [listing]);

  useEffect(() => {
    const changeBackgroundImage = () => {
      const randomIndex = Math.floor(Math.random() * gallery.length);
      const randomImage = gallery[randomIndex]?.photos[0] ?? 0;
      setBgImage(`${randomImage}`);
    };

    changeBackgroundImage();

    const interval = setInterval(changeBackgroundImage, 7000);

    return () => clearInterval(interval);
  }, [gallery]);

  const fetchFlatData = async () => {
    try {
      // con
      const flatData = await fetchListingById(id);
      setListing(flatData);
    } catch (error) {
      openSnackbar('Failed to query for request flat', 'error');
      // push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFlatData = async () => {
      try {
        // con
        const flatData = await fetchListingById(id);
        setListing(flatData);
      } catch (error) {
        openSnackbar('Failed to query for request flat', 'error');
        // push('/');
      } finally {
        setLoading(false);
      }
    };
    if (!id) return;
    fetchFlatData();
  }, [id, openSnackbar]);

  useEffect(() => {
    // cleanup for store data
    return () => {
      setComments([]);
      setGallery([]);
    };
  }, []);

  const flatType = AllFlatTypes.find((i) => i.id === listing?.flatTypes[0]);

  if (loading) {
    return (
      <div className='px-4'>
        <FullListingSkeleton />
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) {
      openSnackbar('Please login to like this listing!', 'info');
      return;
    }
    const _isLiked = isLiked
      ? listing?.liked_by.filter((a) => a !== user?.$id)
      : [...listing!.liked_by, user!.$id];

    await updateListingById(listing?.$id, { liked_by: _isLiked });
    setIsLiked(!isLiked);

    // create notification on liked
    if (isLiked) {
      await createListingLikeNotification(
        listing?.$id,
        user.$id,
        listing?.userID
      );
      //!FEATURE - email for notification update
    }
  };

  const handleAddtoList = async () => {
    if (!user) {
      openSnackbar('Please login to add to list!', 'info');
      return;
    }
    const savedList = inSavedList
      ? listing?.saved_by.filter((a) => a !== user?.$id)
      : [...listing!.saved_by, user!.$id];
    await updateListingById(listing?.$id, { saved_by: savedList });
    openSnackbar(`Flat ${inSavedList ? 'Removed from ' : 'Added to '} My List`);
    setInSavedList(!inSavedList);
  };

  const futureUpdate = () => {
    openSnackbar(`Sharing for flatmate feature is not available`, 'info');
  };

  const handleReserveClick = () => {
    if (!user) {
      openSnackbar('Please login to use this feature!', 'info');
      return;
    }
    setReserveModal(true);
  };
  const handleOpenTourModal = () => {
    if (!user) {
      openSnackbar('Please login to use this feature!', 'info');
      return;
    }
    setTourModal(true);
  };

  return (
    <>
      <div className='h-auto w-full'>
        <div className=' relative h-[86vh] w-full overflow-y-scroll px-3 md:px-9'>
          <div className=' flex '>
            <div className='hidden min-w-[350px] max-w-[350px] md:block'></div>
            <div className=' flex-grow py-5'>
              <h1 className=' text-primary-main text-xl font-semibold md:text-3xl'>
                {flatType?.label} Flat for sale in {listing?.flatCity},{' '}
                {listing?.flatCountry}
              </h1>

              <div className='flex flex-grow font-semibold md:hidden'>
                <span className='flex-grow'>
                  {' '}
                  {/* //!FUTURE: priorite cost with available type */}
                  {listing?.costs?.currency} {listing?.costs?.monthlyCost}
                </span>{' '}
                <div className='space-x-2'>
                  <Button
                    onClick={handleReserveClick}
                    variant='contained'
                    className='bg-secondary-main'
                  >
                    Reserve
                  </Button>
                  <Button onClick={handleOpenTourModal} variant='outlined'>
                    Request A Tour
                  </Button>
                </div>
              </div>

              <div className='flex flex-row-reverse'>
                <IconButton onClick={handleAddtoList}>
                  {inSavedList ? (
                    <FaBookmark />
                  ) : (
                    <FaRegBookmark className='relative m-auto ' />
                  )}
                </IconButton>
                {/* !FUTUREUPDATE: flat re-sharing for roommates */}
                <IconButton onClick={futureUpdate}>
                  <RiShareForwardFill />
                </IconButton>
                <IconButton onClick={handleLike}>
                  {isLiked ? <FcLike /> : <FcLikePlaceholder />}
                </IconButton>
              </div>
            </div>
          </div>

          <div className='sticky top-0 z-10  flex bg-white pl-2 pt-1 md:pl-5'>
            <div className='sticky top-0 md:min-w-[350px] md:max-w-[350px]'></div>
            <div className='relative flex flex-wrap gap-3 py-1'>
              <Link href='#gallery'>
                {' '}
                <div className=' bg-primary-main hover:bg-secondary-main cursor-pointer rounded-sm p-1 px-3 text-left text-white'>
                  Gallery
                </div>
              </Link>
              <Link href='#amenities'>
                <div className=' bg-primary-main hover:bg-secondary-main cursor-pointer rounded-sm p-1 px-3 text-left text-white'>
                  Amenities
                </div>
              </Link>
              <Link href='#policies'>
                {' '}
                <div className=' bg-primary-main hover:bg-secondary-main cursor-pointer rounded-sm p-1 px-3 text-left text-white'>
                  Policies
                </div>
              </Link>
              <Link href='#costs'>
                {' '}
                <div className=' bg-primary-main hover:bg-secondary-main cursor-pointer rounded-sm p-1 px-3 text-left text-white'>
                  Costs
                </div>
              </Link>

              {listing?.flatGeo && (
                <Link href='#location'>
                  {' '}
                  <div className=' bg-primary-main hover:bg-secondary-main cursor-pointer rounded-sm p-1 px-3 text-left text-white'>
                    Location
                  </div>
                </Link>
              )}

              <Link href='#comment'>
                {' '}
                <div className=' bg-primary-main hover:bg-secondary-main cursor-pointer rounded-sm p-1 px-3 text-left text-white'>
                  Comments
                </div>
              </Link>
            </div>
          </div>
          <div className='flex w-full '>
            <div className='sticky top-0 z-50 hidden min-w-[350px] max-w-[350px] shadow-lg md:block '>
              <div className='fixed top-[80px]  z-50 h-[80vh] w-[350px] p-5 pr-12 '>
                <FlatSidebar listing={listing} />
              </div>
            </div>

            <div className='min-h-[1100px] flex-grow md:pl-5 '>
              {/* gallery part */}
              <div className='relative h-[70vh] w-full ' id='gallery'>
                <div className='relative mt-5 h-full w-full '>
                  <ImageCard fileID={bgImage} />
                  <div className='absolute bottom-0 right-0 border'>
                    <GalleryModal src={bgImage} totalImgs={gallery.length} />
                  </div>
                </div>
              </div>

              <section className='h-auto w-full pt-2' id='amenities'>
                <AllAmenities
                  buildingAmenities={listing?.buildingAmenities}
                  flatAmenities={listing?.flatAmenities}
                />
              </section>
              <section id='policies' className='pt-2'>
                <Policies flatPolicies={listing?.flatPolicies} />
              </section>
              <section id='costs'>
                <Costs costs={listing?.costs as any} />
              </section>
              {listing?.flatGeo && (
                <section className='relative z-0' id='location'>
                  <Map position={listing?.flatGeo} />
                </section>
              )}
              <section id='comment'>
                <Comment listingID={listing?.$id} sellerID={listing?.userID} />
              </section>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={reserveModal} onClose={() => setReserveModal(false)}>
        <ReserveModal
          listing={listing!}
          listingID={listing?.$id}
          onClose={() => setTourModal(false)}
        />
      </Modal>
      <Modal
        isOpen={tourModal}
        className=''
        onClose={() => setTourModal(false)}
      >
        <RequestForTourModal
          sellerID={listing?.userID}
          listingID={listing?.$id}
          onClose={() => setTourModal(false)}
        />
      </Modal>
    </>
  );
};

export default DetailView;

function LayoutWrapper(props: WithAuthProps) {
  return <MainLayout>{props.page}</MainLayout>;
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'optional'
);
DetailView.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
