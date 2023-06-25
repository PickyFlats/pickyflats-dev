import React from 'react';

import { MESSAGES_BUCKET, storage } from '@/lib/client-old';

export default function MessageAttachment({ id }) {
  const attachment = storage.getFilePreview(MESSAGES_BUCKET, id);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={attachment.href} alt='' className='rounded-md md:w-52' />;
}
