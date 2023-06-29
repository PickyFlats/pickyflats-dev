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
  const { onNewMessage } = useChatStore();
  //socket
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [ioConnectionId, setIOConnectionId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      socket.emit('user:subscribe');

      // TODO: continue
      socket.on('message:new', async (data) => {
        let message = new TextDecoder().decode(data);
        message = JSON.parse(message);
        onNewMessage(message);
      });

      // listen for msg sent successfully
      socket.on('message:sent', async (data) => {
        let message = new TextDecoder().decode(data);
        message = JSON.parse(message);
        onNewMessage(message);
      });
    }
  }, [isConnected]);

  const sendMessageIO = async (message) => {
    const encodedMessage = new TextEncoder().encode(JSON.stringify(message));
    //
    if (socket) {
      // TODO: send message usign socket for real time messaging
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
