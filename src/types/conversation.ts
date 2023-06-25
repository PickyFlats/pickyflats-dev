import { Message } from '@/types/message';

export interface Conversation {
  participants: string[] | any[];
  lastUpdated: string;
  lastMessageID: string;
  chatStarter: string;
  $id: string;
  $databaseId: string;
  participant: Participant;
  lastMessage: Message;

  $createdAt: string;
  $updatedAt: string;
}

export interface Participant {
  role: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  profileVerified: boolean | null;
  accountType: string;
  lastActivity: string;
  listenerID: string;
  personalInterest: string[];
  referredSource: string[];
  country: string;
  city: string;
  email: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
}
