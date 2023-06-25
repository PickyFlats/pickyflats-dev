import { AppwriteException } from 'appwrite';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

import useResponsive from '@/hooks/useResponsive';

import { getConversationByID } from '@/database/conversation';
import { getMessagesByConversation } from '@/database/message';
import { getUserProfileForChat } from '@/database/profile';

import DashboardLayout from '@/components/layout/DashboardLayout';
import LightboxModal from '@/components/LightboxModal';
import Loader from '@/components/Loader';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';
import useLightBoxStore from '@/store/useLightBoxStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import ChatActiveHeader from '@/features/chat/ChatActiveHeader';
import ChatMessages from '@/features/chat/ChatMessages';
import ChatSidebar from '@/features/chat/ChatSidebar';
import ChatInputMessage from '@/features/chat/InputMessage';
import withAuth, { WithAuthProps } from '@/hoc/withAuth';

export default function UserMessagePage() {
  const {
    query: { conversationId: rawConvId },
    push,
  } = useRouter();
  const conversationId = rawConvId!.toString();
  const { user } = useAuthStore();
  const { openSnackbar } = useSnackbarStore();

  const [chatUser, setChatUser] = React.useState<any>();
  const [loading, setLoading] = React.useState(true);
  const [messageLoading, setMessageLoading] = React.useState(true);

  const { messages, setMessages } = useChatStore();

  const {
    images,
    selectedIndex: selectedImage,
    setPhotoIndex,
    isOpen: isLightBoxOpen,
    setIsOpen: setLightBoxOpen,
  } = useLightBoxStore();

  const fetchConversation = async () => {
    const _conversation = await getConversationByID(conversationId!.toString());
    // push to messages if not exits
    if (!_conversation) {
      push('/messages');
      return;
    }
    const _chatUserId = _conversation.participants.find((i) => i !== user?.$id);
    const validConversation =
      _conversation.participants.findIndex((i) => i === user?.$id) !== -1;
    // invalidate the conversation if session user is not in the list
    if (!validConversation) {
      throw new AppwriteException('Invalid conversation attempt', 404);
    }

    // fetch chat user
    const _chatUser = await getUserProfileForChat(_chatUserId);

    setChatUser(_chatUser);
    setLoading(false);

    // load messages only after fetching chat user
    const _messages = await getMessagesByConversation(conversationId);
    setMessages(_messages);
  };

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setMessageLoading(true);
        await fetchConversation();
        setMessageLoading(false);
      } catch (error) {
        if (error instanceof AppwriteException) {
          if (error.code == 404) push('/messages');
        }
        openSnackbar('Failed to load conversation', 'error');
      }
    };
    loadConversation();
  }, [conversationId]);

  const messagesContainer = useRef<HTMLDivElement>(null);

  const handleOnNewMessage = () => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop =
        messagesContainer.current.scrollHeight;
    }
  };

  const isLargeScreen = useResponsive('up', 'lg');
  return (
    <>
      <div className='flex h-[calc(100vh-70px)] max-md:h-[calc(100vh-50px)]'>
        {isLargeScreen && <ChatSidebar />}
        <div className='relative flex w-full flex-col'>
          {chatUser && <ChatActiveHeader user={chatUser} />}
          <div
            className='flex flex-1 flex-col overflow-y-auto px-4 py-2'
            ref={messagesContainer}
          >
            {messageLoading && <Loader className='my-auto' />}
            {!messageLoading && (
              <ChatMessages
                conversationId={conversationId}
                chatUser={chatUser}
                cbOnNewMessage={handleOnNewMessage}
              />
            )}
          </div>
          <div className='border border-gray-300 py-2'>
            <ChatInputMessage
              conversationID={conversationId}
              receiverID={chatUser?.$id}
            />
          </div>
        </div>
      </div>

      <LightboxModal
        images={images}
        mainSrc={images[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setPhotoIndex}
        isOpen={isLightBoxOpen}
        onCloseRequest={() => setLightBoxOpen(false)}
      />
    </>
  );
}

function LayoutWrapper(props: WithAuthProps) {
  return <DashboardLayout>{props.page}</DashboardLayout>;
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'all'
);
UserMessagePage.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
