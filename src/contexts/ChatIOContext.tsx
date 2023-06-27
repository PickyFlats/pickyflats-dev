import { createContext, ReactNode, useState } from 'react';

import { chatIO as socket } from '@/lib/socket';

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
  //socket
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [ioConnectionId, setIOConnectionId] = useState<string | null>(null);

  const sendMessageIO = async (message) => {
    //
    if (socket) {
      // TODO: send message usign socket for real time messaging
      console.log('send message at socket level here.. ');
      // socket.emit('message', JSON.stringify(message));
      // socket.emit('message', message);
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
