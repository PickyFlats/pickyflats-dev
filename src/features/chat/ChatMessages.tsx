/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import withAppURL from '@/lib/url';

import MessageItem from '@/components/chat/MessageItem';

import useChatStore from '@/store/useChatStore';
import useLightBoxStore from '@/store/useLightBoxStore';

import { UserProfile } from '@/types/user';

export default function ChatMessages({
  conversationId,
  chatUser,
  cbOnNewMessage,
}: {
  conversationId;
  chatUser?: UserProfile;
  cbOnNewMessage?: () => void;
}) {
  const { messages, onNewMessage } = useChatStore();
  const { setImages } = useLightBoxStore();
  React.useEffect(() => {
    // const unsubscribe = client.subscribe(
    //   `databases.${DATABASE_ID}.collections.${CONVERSATIONS_ID}.documents.${conversationId}`,
    //   (chat) => {
    //     const chatPayload: any = chat.payload;
    //     const newMessageId = chatPayload?.lastMessageID;
    //     const loadNewMessage = async () => {
    //       const newMessage = await getMessageById(newMessageId);
    //       onNewMessage(newMessage);
    //       //TODO: ! same msg push render issue
    //     };
    //     loadNewMessage();
    //     // cb for on new message
    //     cbOnNewMessage?.();
    //   }
    // );
    // return () => unsubscribe();
  }, [cbOnNewMessage, conversationId, onNewMessage]);

  React.useEffect(() => {
    const _attachments: string[] = [];
    messages.allIds
      .filter((id) => messages.byId[id]?.attachments.length > 0)
      .map((id) => {
        const __attachments: string[] = [];
        messages.byId[id].attachments.map((a) => {
          __attachments.push(withAppURL(`/files/${a}`));
        });
        _attachments.push(...__attachments);
      });
    setImages(_attachments);
  }, [messages]);

  return (
    <>
      <div className='flex flex-col space-y-4'>
        {messages.allIds.map((messageID, index) => {
          const message = messages.byId[messageID];
          if (!message) return <></>;
          return (
            <MessageItem
              key={index}
              index={index}
              message={message}
              chatUser={chatUser}
            />
          );
        })}
      </div>
    </>
  );
}
