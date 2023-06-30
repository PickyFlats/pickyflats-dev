import { Avatar, Button, Divider } from '@mui/material';
import { useEffect, useState } from 'react';

import { timeAgo } from '@/lib/date';

import { getCommentsByListingID } from '@/database/comment';

import useListingStore from '@/store/useListingStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import CommentBoxCard from '@/features/Comment/cards/CommentBoxCard';

export const Comment = ({
  listingID,
  sellerID,
}: {
  listingID?: string;
  sellerID?: string;
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [loading, setLoading] = useState(true);

  const { comments, setComments, refreshCount } = useListingStore();
  const { openSnackbar } = useSnackbarStore();

  const fetchComments = async () => {
    try {
      const comments = await getCommentsByListingID(listingID);
      setComments(comments);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [refreshCount]);

  //!FUTURE
  const futureUpdate = () => {
    openSnackbar(`Feature is not available`, 'info');
  };

  return (
    <div>
      <div className='flex w-full pb-5'>
        <div className='flex-grow text-2xl font-semibold'>Comments</div>
        <div className=' rounded-xl border'>
          <Button className=' bg-slate-100 capitalize' onClick={futureUpdate}>
            Recent
          </Button>
          <Button className=' capitalize' onClick={futureUpdate}>
            Popular
          </Button>
        </div>
        <Divider />
      </div>
      <div className='comments space-y-2'>
        {comments && comments?.length < 1 && (
          <h2 className='text-secondary-main text-xl font-semibold'>
            Be the first one to leave a comment on this listing!
          </h2>
        )}
        {comments?.map((item, i) => {
          return (
            <div
              key={i}
              className='bg-white-default relative flex h-auto w-full gap-4'
            >
              <div className='flex flex-col'>
                <div className='relative flex  max-h-max w-[32px] flex-col  '>
                  <Avatar
                    src='/Akash.svg'
                    sx={{ width: '32px', height: '32px' }}
                  />
                </div>
                <div className='relative flex flex-grow flex-col items-center text-center '>
                  <div className='mt-1 h-full w-[1px] bg-[#CBD4EC] opacity-50'></div>
                </div>
              </div>
              <div className='flex-grow '>
                <div className=''>
                  <h2 className=' text-lg font-medium leading-[150%] text-[#0F0C28]'>
                    {`${item.user?.firstName} ${item.user?.lastName}`}
                  </h2>
                </div>
                {/* actual comment */}
                <div className='mt-4'>
                  <p className='text-text-secondary-default  my-2 text-sm font-medium leading-[150%]'>
                    {item?.text}
                  </p>
                </div>
                {/* reply box */}
                {/* !FEATURE UDPATE */}
                {/* {showReplyBox && (
            <div>
              <ReplyCard />
            </div>
          )} */}
              </div>
              <div className=''>
                <p className='text-text-secondary-default  text-sm font-medium leading-[150%]'>
                  {timeAgo(new Date(item.$createdAt))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className='my-9'>
        <CommentBoxCard listingID={listingID} sellerID={sellerID} />
      </div>
    </div>
  );
};
