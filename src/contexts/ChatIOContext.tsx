import { createContext, ReactNode, useEffect, useState } from 'react';

import { chatIO as socket } from '@/lib/socket';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';

interface ChatIOContextProps {
  conversation: any | null;
  participants: any[];
  onChangeChatUser?: (user: any) => void;
  sendMessageIO?: (message) => Promise<void>;
  onDeleteMessagIO?: (data: any) => void;
  setActiveConversation?: (id) => void;
  chatUser: any | null;
  setChatUser?: (user) => void;
}

const initialState: ChatIOContextProps = {
  conversation: null,
  participants: [],
  chatUser: null,
};

const ChatIOContext = createContext<ChatIOContextProps>(initialState);

function ChatIOProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const { onNewMessage, onNewMessageConversation, onDeleteMessage } =
    useChatStore();

  const [chatUser, setChatUser] = useState<any>();

  //socket
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [conversation, setConversation] = useState<any | null>(null);
  const [ioConnectionId, setIOConnectionId] = useState<string | null>(null);

  const handleOnNewMessage = (data) => {
    let message: any = new TextDecoder().decode(data);
    message = JSON.parse(message);
    onNewMessageConversation(message?.conversationID, message);
    onNewMessage(message);
  };

  const handleMessageDeleted = (data) => {
    let message: any = new TextDecoder().decode(data);
    message = JSON.parse(message);
    onDeleteMessage(message['messageID']);
  };

  useEffect(() => {
    if (isConnected) {
      socket.emit('user:subscribe');
      socket.on('message:new', handleOnNewMessage);
      // listen for msg sent successfully
      socket.on('message:sent', handleOnNewMessage);
      socket.on('message:deleted', handleMessageDeleted);
      // cleanup
      return () => {
        socket.off('user:subscribe');
        socket.off('message:new');
        socket.off('message:sent');
        socket.off('message:deleted');
      };
    }
  }, [chatUser, isConnected]);

  const sendMessageIO = async (message) => {
    if (socket) {
      const encodedMessage = new TextEncoder().encode(JSON.stringify(message));
      socket.emit('message', encodedMessage);
    }
  };

  const onDeleteMessagIO = (messageID) => {
    const encodedData = new TextEncoder().encode(
      JSON.stringify({
        conversationID: conversation?.$id,
        messageID,
        to: chatUser?.$id,
      })
    );
    socket.emit('message:delete', encodedData);
  };

  const chatContextValue: ChatIOContextProps = {
    conversation,
    setActiveConversation: setConversation,
    participants: [],
    sendMessageIO,
    onDeleteMessagIO,
    chatUser,
    setChatUser,
  };
  return (
    <ChatIOContext.Provider value={chatContextValue}>
      {children}
    </ChatIOContext.Provider>
  );
}

export { ChatIOContext, ChatIOProvider };
