/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID, Query } from 'appwrite';

import {
  DATABASE_ID,
  databases,
  LISTINGS_ID,
  NOTIFICATIONS_ID,
  PROFILES_ID,
} from '@/lib/client-old';

import { getCommentsByIDs } from '@/database/comment';

import { Notification } from '@/types/notification';

export const getNotificationByUserID = async (userID) => {
  //
  const notifications = await databases.listDocuments(
    DATABASE_ID,
    NOTIFICATIONS_ID,
    [Query.equal('userID', userID)]
  );

  if (notifications.total < 1) return [];

  // filter out
  const _listingIDs = notifications.documents
    .filter((item) => item.listingId !== null)
    .map((l) => l.listingId);
  const _commentIDs = notifications.documents
    .filter((item) => item.commentId !== null)
    .map((l) => l.commentId);
  const _LikedUserIDs = notifications.documents
    .filter((item) => item.likedUserID !== null)
    .map((l) => l.likedUserID);

  const _notifications: any[] = [];

  // fetch listings
  const _listings = await databases.listDocuments(DATABASE_ID, LISTINGS_ID, [
    Query.equal('$id', _listingIDs),
  ]);

  const notificationsWithlistings = notifications.documents.map(
    (notification) => {
      const listing = _listings.documents.find(
        (l) => l.$id === notification.listingId
      );

      return { ...notification, listing };
    }
  );

  // fetch comments with users notifications
  if (_commentIDs.length > 0) {
    const _comments = await getCommentsByIDs(_commentIDs);
    const commentNotifications = _comments.map((comment) => {
      const notification = notificationsWithlistings.find(
        (n: any) => n.commentId === comment.$id
      );
      return { ...notification, comment };
    });

    _notifications.push(...commentNotifications);
  }

  // fetch liked profiles notifications
  if (_LikedUserIDs.length > 0) {
    const _profiles = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
      Query.equal('$id', _LikedUserIDs),
    ]);
    const commentNotifications = _profiles.documents.map((profile) => {
      const notification = notificationsWithlistings.find(
        (n: any) => n.likedUserID === profile.$id
      );
      return { ...notification, profile };
    });

    _notifications.push(...commentNotifications);
  }

  //!FUTURE - booking/tour reqeust notifications

  return _notifications as Notification[];
};

export const createListingLikeNotification = async (
  listingID,
  likedBy,
  sellerID
) => {
  await databases.createDocument(DATABASE_ID, NOTIFICATIONS_ID, ID.unique(), {
    type: 'like',
    userID: sellerID, // notification receiver
    likedUserID: likedBy,
    listingId: listingID,
  });
};

export const createListingCommentNotification = async (
  listingID,
  sellerID,
  commentID
) => {
  await databases.createDocument(DATABASE_ID, NOTIFICATIONS_ID, ID.unique(), {
    type: 'commented',
    userID: sellerID, // notification receiver
    listingId: listingID,
    commentId: commentID,
  });
};
