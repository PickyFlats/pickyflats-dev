/* eslint-disable @next/next/no-img-element */
interface Iprops {
  fileID: string;
}

import { withCDNURL } from '@/lib/url';

export const Viewer = (props: Iprops) => {
  const { fileID } = props;

  return (
    <div className='relative h-[200px] w-full border border-solid border-gray-200'>
      <img
        src={withCDNURL(`/files/${fileID}`)}
        alt='preview image'
        className=' h-full w-full object-cover'
      />
      {/* <Image src={props.url} fill alt='preview image' /> */}

      {/* <div className='absolute top-0 right-0'><IconButton onClick={()=>deleteImg()}>D</IconButton></div> */}
    </div>
  );
};
