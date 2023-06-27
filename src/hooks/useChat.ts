import { useContext } from 'react';

import { ChatIOContext } from '@/contexts/ChatIOContext';
//
// ----------------------------------------------------------------------
export const useChatIO = () => {
  const context = useContext(ChatIOContext);

  if (!context)
    throw new Error('ChatIO context must be use inside ChatIOProvider');

  return context;
};
