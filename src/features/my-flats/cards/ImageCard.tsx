/* eslint-disable @next/next/no-img-element */
interface Iprops {
  fileID: string;
}

import { withCDNURL } from '@/lib/url';

export const ImageCard = (props: Iprops) => {
  const { fileID } = props;

  return (
    <div className='relative h-full w-full'>
      <img
        src={withCDNURL(`/files/${fileID}`)}
        alt='preview image'
        className=' h-full w-full rounded-md object-cover'
      />

      {/* <div className='absolute top-0 right-0'><IconButton onClick={()=>deleteImg()}>D</IconButton></div> */}
    </div>
  );
};
