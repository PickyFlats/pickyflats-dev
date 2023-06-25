import { ID, Query } from 'appwrite';

import { DATABASE_ID, databases, LISTENERS_ID } from '@/lib/client-old';

import { updateUserProfileById } from '@/database/user';

type ListenerUpdateType = 'Notification' | 'Message';
export const pushListenerUpdate = async (
  receiverId,
  type: ListenerUpdateType
) => {
  const listenerSearch = await databases.listDocuments(
    DATABASE_ID,
    LISTENERS_ID,
    [Query.equal('user', receiverId)]
  );

  if (listenerSearch.total > 0) {
    await databases.updateDocument(
      DATABASE_ID,
      LISTENERS_ID,
      listenerSearch.documents[0].$id,
      {
        updateType: type,
        pushUpdateTime: new Date(),
      }
    );
  } else {
    // create if not in the listeners
    await createListener(receiverId, 'Message');
  }
};

export const createListener = async (receiverId, type?: ListenerUpdateType) => {
  const listener = await databases.createDocument(
    DATABASE_ID,
    LISTENERS_ID,
    ID.unique(),
    {
      user: receiverId,
      updateType: type,
      pushUpdateTime: new Date(),
    }
  );
  // update listener ID for profile
  await updateUserProfileById(receiverId, { listenerID: listener.$id });
};
