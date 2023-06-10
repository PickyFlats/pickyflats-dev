import { Query } from 'appwrite';

import {
  CONVERSATIONS_ID,
  DATABASE_ID,
  databases,
  MESSAGES_ID,
  PROFILES_ID,
} from '@/lib/client';

interface IProps {
  limit?: number;
}

// fetch user conversations
export const fetchConversationsForUser = async (userId, props?: IProps) => {
  const _listConversations = await databases.listDocuments(
    DATABASE_ID,
    CONVERSATIONS_ID
    // [Query.equal('participants', [userId])]
    // [Query.search('participants', userId)] // ! try on production
  );

  const _conversations = _listConversations.documents;
  // filters all participants from conversations for profile fetching
  const participantIds = [
    ...new Set(
      _conversations.flatMap((conversation) =>
        conversation.participants.filter(
          (participant) => participant !== userId
        )
      )
    ),
  ];

  const _profiles = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
    Query.equal('$id', participantIds),
    Query.select(['name', 'profile_img', 'profileVerified', 'lastActivity']),
  ]);

  const lastMessageIds: string[] = [];

  // filter & map to relavant conversation for fetched profiles
  const conversationsWithProfiles = _conversations.map((conversation) => {
    // extract last message IDs
    if (conversation.lastMessageID)
      lastMessageIds.push(conversation.lastMessageID);

    const participantProfile = conversation.participants
      .filter((participant) => participant !== userId)
      .map((participantId) =>
        _profiles.documents.find((profile) => profile.$id === participantId)
      );
    return { ...conversation, participant: participantProfile?.[0] };
  });

  const _lastMessages = await databases.listDocuments(
    DATABASE_ID,
    MESSAGES_ID,
    [
      Query.equal('$id', lastMessageIds),
      Query.select(['senderID', 'message', 'attachments']),
    ]
  );

  // map last messages
  const conversationsWithMessages = conversationsWithProfiles.map(
    (conversation: any) => {
      const lastMessage = _lastMessages.documents.find(
        (message) => message.$id === conversation.lastMessageID
      );

      return { ...conversation, lastMessage: lastMessage || null };
    }
  );

  return conversationsWithMessages;
};
