import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiFillDelete, AiFillEye } from 'react-icons/ai';
import { BiComment } from 'react-icons/bi';
import { FcLike } from 'react-icons/fc';
import { MdBathroom, MdBedroomParent, MdKitchen } from 'react-icons/md';

import { CONTENT_BUCKET, storage } from '@/lib/client-old';
import clsxm from '@/lib/clsxm';
import logger from '@/lib/logger';

import { AllFlatTypes } from '@/datas/flatTypes';

import { Iroom } from '@/store/flatStore';
import useListingsStore from '@/store/useListingsStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import Dialog from '@/features/Dialog';
import { ImageCard } from '@/features/my-flats/cards/ImageCard';
import { UpdateFlatModal } from '@/features/my-flats/Modal/UpdateFlatModal';

import { Listing } from '@/types/listing';

interface Iprop {
  // data: Iroom | null;
  data: Listing | null;
}

export const MyFlatCard = (props: Iprop) => {
  const { data } = props;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [gallery, setGallery] = useState<Iroom[]>([]);

  const { refresh } = useListingsStore();
  const { openSnackbar } = useSnackbarStore();
  const deleteFlatListing = async () => {
    const _gallery: Iroom[] = JSON.parse(data!.gallery.toString());

    for await (const gallery of _gallery) {
      for await (const photoID of gallery.photos) {
        await storage.deleteFile(CONTENT_BUCKET, photoID);
      }
    }
    // await deleteListing(data?.$id, data?.costs?.$id);

    openSnackbar('Listing delete successfully', 'warning', {
      horizontal: 'center',
      vertical: 'top',
    });
    refresh();
  };

  const closeDialog = () => setOpenDeleteDialog(false);
  const handleDeleteDialog = () => setOpenDeleteDialog(true);

  useEffect(() => {
    const decodeGallery = () => {
      try {
        // const _gallery: Iroom[] = JSON.parse(data!.gallery.toString());
        setGallery(data?.gallery || []);
      } catch (error) {
        logger('Listing Gallery load failed');
      }
    };
    decodeGallery();
  }, [data]);

  const flatType = AllFlatTypes.find((i) => i.id === data?.flatTypes[0]);

  const flatImageID =
    gallery?.length > 0 && gallery[0].photos.length > 0
      ? gallery[0].photos[0]
      : '';

  return (
    <div>
      <Dialog
        open={openDeleteDialog}
        type='delete'
        hideDialog={closeDialog}
        callBack={deleteFlatListing}
        Title='Are You Sure ?'
        SubTitle='Are you sure you want to delete this listing? This action cannot be undone.'
      />
      <div
        className={clsxm(
          'bg-secondary-main ', //!TODO: try for better theming
          // 'shadow-md',
          'relative flex h-[450px]  w-[300px] flex-col items-center justify-center rounded-lg p-3 pt-4 align-middle'
        )}
      >
        <div className='relative z-50 h-[30vh] w-full rounded-3xl'>
          <ImageCard fileID={flatImageID} />
          {/* <img alt='' src={flatImage} className='h-full w-full rounded-3xl' /> */}
          {/* <Image src='/images/1.jpg' alt='room ' fill className='rounded-md' /> */}
        </div>
        <div className='text-primary-main absolute right-6 top-10 z-50 m-auto flex h-[40px] justify-center  space-x-1 rounded-md align-middle text-lg'>
          {/* <EditRoomsModal data={data} /> */}
          <UpdateFlatModal data={data!} />
          <div>
            <IconButton
              onClick={handleDeleteDialog}
              color='error'
              className='bg-red-200 hover:bg-red-300'
            >
              <AiFillDelete />
            </IconButton>
          </div>
        </div>
        <div className='relative h-auto w-full pt-3'>
          <h3 className='line-clamp-1 p-1 text-lg font-bold text-white'>
            {data?.costs?.currency} {data?.costs?.monthlyCost}
          </h3>
          <h3 className='line-clamp-1 p-1 text-lg font-bold text-blue-950'>
            <Link href={`/flats/${data?.$id}`}>
              {flatType?.label} For Sale In {data?.flatCity}
            </Link>
          </h3>
          <h3 className='line-clamp-1 p-1 text-sm font-bold text-black'>
            {data?.flatStreet1}, {data?.flatCountry}
          </h3>
          <div className='my-3 flex space-x-4 text-sm text-black'>
            <div className=' flex items-center text-lg'>
              <MdBedroomParent />
              <span className='ml-1 mt-1 text-sm'>{data?.room}</span>
            </div>
            <div className=' flex items-center text-lg'>
              <MdKitchen />
              <span className='ml-1 mt-1 text-sm'>{data?.kitchen}</span>
            </div>
            <div className=' flex items-center text-lg'>
              <MdBathroom />
              <span className='ml-1 mt-1 text-sm'>{data?.bathroom}</span>
            </div>
          </div>
          <div className='flex gap-3'>
            <span className='rounded-full border-[2px] bg-black px-3 py-1 text-white'>
              {flatType?.label}
            </span>

            {/* <span className='rounded-full border-[2px]  bg-black px-3 py-1 text-white'>
              1 bhk
            </span> */}
          </div>
          <div className='mt-1 flex flex-row-reverse space-x-1'>
            <Link href={`/flats/` + data?.$id}></Link>
            <IconButton>
              <AiFillEye />
            </IconButton>
            <IconButton className='items flex'>
              {/* <span className=' relative pr-1 text-lg'>12</span> */}
              <BiComment />
            </IconButton>

            {/* <Button className='items flex space-x-1 rounded-md text-black'>
              <span className=' relative pr-1 text-lg'>12</span>
              <BiComment />
            </Button> */}

            <IconButton>
              <span className=' relative pr-1 text-lg'>
                {data?.liked_by?.length || ''}
              </span>
              <FcLike />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
