/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { withCDNURL } from '@/lib/url';

export default function MessageAttachment({ id }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={withCDNURL(`/files/${id}`)}
      alt=''
      className='rounded-md md:w-52'
    />
  );
}
