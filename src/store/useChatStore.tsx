import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import { omit, pull } from 'lodash';
import create from 'zustand';

import { keyArrayFromArray, objFromArray } from '@/lib/object';

import { Message } from '@/types/message';

type IDSeparatedMessageData = {
  byId: { [key: string]: Message };
  allIds: string[];
};

type IDSeparatedData = {
  byId: { [key: string]: any };
  allIds: string[];
};

interface ChatStore {
  firstLoad: boolean;
  // activeChatUser: any;
  conversations: IDSeparatedData;
  setConversations: (conversations: any[]) => void;
  setFirstLoad: (load: boolean) => void; // helper for tracking loader in message page

  // single chat
  messages: IDSeparatedMessageData;
  setMessages: (messages: Message[]) => void;
  onNewMessage: (message) => void;
  onDeleteMessage: (messageId: string) => void;
  // helper to update last message conversation for chat sidebar
  onNewMessageConversation: (convid: string, message) => void;
}

const useChatStoreBase = create<ChatStore>((set) => ({
  firstLoad: false,
  conversations: { byId: {}, allIds: [] },
  messages: { byId: {}, allIds: [] },
  setConversations: (conversations) => {
    const byId = objFromArray(conversations);
    const allIds = keyArrayFromArray(conversations);
    set(() => ({ conversations: { byId, allIds } }));
  },
  setMessages: (messages) => {
    const byId = objFromArray(messages);
    const allIds = keyArrayFromArray(messages);
    set(() => ({ messages: { byId, allIds } }));
  },
  onNewMessage: (message) => {
    set(
      produce<ChatStore>((state) => {
        const messageId = message.$id;
        state.messages.byId[messageId] = message;
        state.messages.allIds.push(messageId);
      })
    );
  },
  onDeleteMessage: (messageID) => {
    set(
      produce<ChatStore>((state) => {
        state.messages.byId = omit(state.messages.byId, [messageID]);
        state.messages.allIds = pull(state.messages.allIds, messageID);
      })
    );
  },
  setFirstLoad: (load) => set(() => ({ firstLoad: load })),
  onNewMessageConversation: (convid, message) => {
    set(
      produce<ChatStore>((state) => {
        state.conversations.byId[convid].lastMessage = message;
      })
    );
  },
}));

const useChatStore = createSelectorHooks(useChatStoreBase);

export default useChatStore;
