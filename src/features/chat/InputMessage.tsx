/* eslint-disable @next/next/no-img-element */
import { IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { BiImage } from 'react-icons/bi';

import api from '@/lib/api';
import { useChatIO } from '@/hooks/useChat';

import { sendMessage } from '@/database/message';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';
import useSnackbarStore from '@/store/useSnackbarStore';

interface IProps {
  conversationID: string;
  receiverID: string;
}

export default function ChatInputMessage({
  conversationID,
  receiverID,
}: IProps) {
  const { sendMessageIO } = useChatIO();
  const { user } = useAuthStore();
  const { onNewMessageConversation } = useChatStore();
  const { openSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(false);

  const [inputText, setInputText] = React.useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(
    null
  );

  const handleAttachmentChange = (e) => {
    setSelectedAttachment(e.target.files[0]);
  };
  const handleRemoveAttachment = () => {
    setSelectedAttachment(null);
  };

  const handleSendMessage = async () => {
    const attachments: string[] = [];

    // upload attachment if exits
    if (selectedAttachment) {
      const formData = new FormData();
      formData.append('file', selectedAttachment);
      const uploadRes = await api.post('/files/upload', formData);
      attachments.push(uploadRes.data);
    }

    const newMessage = await sendMessage({
      conversationID,
      message: inputText,
      attachments,
    });

    await sendMessageIO?.(newMessage);

    onNewMessageConversation(conversationID, newMessage);

    // update timestamp in conversation id for conversation listeners
    // await databases.updateDocument(
    //   DATABASE_ID,
    //   CONVERSATIONS_ID,
    //   conversationID,
    //   {
    //     lastMessageID: newMessage.$id,
    //     lastUpdated: new Date(),
    //   }
    // );

    // push for listeners update
    // await pushListenerUpdate(receiverID, 'Message');
  };

  const handleSubmit = async () => {
    if (inputText.trim() === '' && !selectedAttachment) return;

    try {
      setLoading(true);
      await handleSendMessage();
      setInputText('');
      setSelectedAttachment(null);
    } catch (error) {
      openSnackbar('Message send failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (loading) return;
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectAttachmentButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='flex flex-col'>
      {loading && (
        <div className='h-1 w-full overflow-hidden bg-gray-200'>
          <div className='bg-secondary-main h-full animate-pulse'></div>
        </div>
      )}

      {selectedAttachment && (
        <div className='border-b  border-gray-200 p-2'>
          <div className='relative h-28 w-28'>
            <img
              src={URL.createObjectURL(selectedAttachment)}
              alt='Selected Attachment'
              className='h-full w-full rounded object-cover'
            />
            <button
              className='absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-sm text-white'
              onClick={handleRemoveAttachment}
            >
              x
            </button>
          </div>
        </div>
      )}

      <div>
        <input
          type='text'
          className='flex-1 px-4 py-2'
          placeholder='Type a message...'
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className='flex justify-between space-x-1 px-2'>
        <div>
          <Tooltip title='Select Attachment'>
            <IconButton onClick={handleSelectAttachmentButtonClick}>
              <BiImage className='' />
            </IconButton>
          </Tooltip>
          <input
            ref={fileInputRef}
            id='attachmentUpload'
            type='file'
            accept='image/*'
            onChange={handleAttachmentChange}
            className='hidden'
          />
        </div>
        <button
          disabled={loading}
          className='rounded bg-blue-500 px-4 py-2 text-white disabled:bg-slate-400'
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
}
