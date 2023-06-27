/* eslint-disable @next/next/no-img-element */
import { IconButton } from '@mui/material';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { BsTrash } from 'react-icons/bs';

import { MESSAGES_BUCKET, PROFILES_BUCKET, storage } from '@/lib/client-old';
import { isEmptyArray } from '@/lib/helper';

import { deleteMessageById } from '@/database/message';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';
import useLightBoxStore from '@/store/useLightBoxStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import MessageAttachment from '@/features/chat/MessageAttachment';

import { Message } from '@/types/message';
import { User } from '@/types/user';

interface IProps {
  index: number;
  chatUser?: User;
  message: Message;
}

export default function MessageItem({ index, chatUser, message }: IProps) {
  const { user } = useAuthStore();
  const { onDeleteMessage } = useChatStore();
  const { images, setIsOpen, setPhotoIndex } = useLightBoxStore();
  const messageUser = message.senderID === user?.$id ? user : chatUser;
  const isSenderMe = message.senderID === user?.$id;

  const chatUserAvatar = storage.getFilePreview(
    PROFILES_BUCKET,
    chatUser?.profilePicture ?? ''
  );

  const { openSnackbar } = useSnackbarStore();

  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessageById(id);
      for await (const attachment of message.attachments) {
        await storage.deleteFile(MESSAGES_BUCKET, attachment);
      }
      onDeleteMessage(id);
    } catch (error) {
      openSnackbar('Message failed to delete', 'error');
    }
  };

  const attachment = !isEmptyArray(message.attachments)
    ? storage.getFileView(MESSAGES_BUCKET, message.attachments[0])
    : null;

  const handleOpenLightbox = (url) => {
    const selectedImage = images.findIndex((index) => index === url);
    setIsOpen(true);
    setPhotoIndex(selectedImage);
  };

  return (
    <div key={index} className={isSenderMe ? 'ml-auto flex flex-col' : ''}>
      <div
        className={clsx(
          'group flex space-x-2 pt-3',
          isSenderMe ? 'ml-auto' : ''
        )}
      >
        {!isSenderMe && (
          <div className='mt-auto'>
            <div className='bg-primary-light relative inline-flex h-8 w-8 items-center justify-center rounded-full'>
              {chatUser?.profilePicture ? (
                <img
                  src={chatUserAvatar.href}
                  alt='Avatar'
                  className='inline-flex h-7 w-7 items-center justify-center rounded-full'
                />
              ) : (
                <span className='text-md font-bold uppercase text-white'>
                  {chatUser?.firstName.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        )}
        {isSenderMe && (
          <div className='my-auto'>
            <IconButton
              className='hidden h-8 w-8 text-sm text-red-500 hover:text-red-700 focus:outline-none group-hover:block'
              onClick={() => handleDeleteMessage(message.$id)}
            >
              <BsTrash />
            </IconButton>
          </div>
        )}
        <div className='space-y-2'>
          {message.message && (
            <div className='flex'>
              <div
                className={`${isSenderMe ? 'ml-auto' : ''} ${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                } relative rounded-lg p-2`}
              >
                <p>{message.message}</p>
              </div>
            </div>
          )}
          {!isEmptyArray(message?.attachments) && (
            <div
              className={`${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
              } relative rounded-lg p-2`}
              onClick={() => handleOpenLightbox(attachment?.href || '')}
            >
              <MessageAttachment id={message?.attachments[0]} />
            </div>
          )}
        </div>
      </div>
      <div
        className={clsx(
          '!mt-0 text-xs text-gray-500',
          isSenderMe ? 'ml-auto' : ''
        )}
      >
        <span className='mr-2'>
          {isSenderMe ? 'You' : messageUser?.firstName}
        </span>
        <span title={`${message.$createdAt}`}>
          {formatDistanceToNow(new Date(message.$createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
}
