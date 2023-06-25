import api from '@/lib/api';
import { DATABASE_ID, databases, MESSAGES_ID } from '@/lib/client-old';

import { Message } from '@/types/message';

export const sendMessage = async (data) => {
  const messageRes = await api.post('/chat/messages/new', data);
  return messageRes.data;
};

export const deleteMessageById = async (id) => {
  // todo delete attachments also if exits
  await databases.deleteDocument(DATABASE_ID, MESSAGES_ID, id);
};

export const getMessageById = async (messageID) => {
  return await databases.getDocument(DATABASE_ID, MESSAGES_ID, messageID);
};

export const getMessagesByConversation = async (conversationID) => {
  const messageRes = await api.get(`/chat/messages/c/${conversationID}`);
  return messageRes.data as Message[];
};
