import { createContext, ReactNode, useEffect, useState } from 'react';

import { chatIO as socket } from '@/lib/socket';

import useAuthStore from '@/store/useAuthStore';
import useChatStore from '@/store/useChatStore';

interface ChatIOContextProps {
  connectionId: string | null;
  participants: any[];
  onChangeChatUser?: (user: any) => void;
  sendMessageIO?: (message) => Promise<void>;
}

const initialState: ChatIOContextProps = {
  connectionId: null,
  participants: [],
};

const ChatIOContext = createContext<ChatIOContextProps>(initialState);

function ChatIOProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const { onNewMessage, onNewMessageConversation } = useChatStore();
  //socket
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [ioConnectionId, setIOConnectionId] = useState<string | null>(null);

  const handleOnNewMessage = (data) => {
    let message: any = new TextDecoder().decode(data);
    message = JSON.parse(message);
    onNewMessageConversation(message?.conversationID, message);
    onNewMessage(message);
  };

  useEffect(() => {
    if (isConnected) {
      socket.emit('user:subscribe');
      socket.on('message:new', handleOnNewMessage);
      // listen for msg sent successfully
      socket.on('message:sent', handleOnNewMessage);
      // cleanup
      return () => {
        socket.off('user:subscribe');
        socket.off('message:new');
        socket.off('message:sent');
      };
    }
  }, [isConnected]);

  const sendMessageIO = async (message) => {
    if (socket) {
      const encodedMessage = new TextEncoder().encode(JSON.stringify(message));
      socket.emit('message', encodedMessage);
    }
  };

  const chatContextValue: ChatIOContextProps = {
    connectionId,
    participants: [],
    sendMessageIO,
  };
  return (
    <ChatIOContext.Provider value={chatContextValue}>
      {children}
    </ChatIOContext.Provider>
  );
}

export { ChatIOContext, ChatIOProvider };
