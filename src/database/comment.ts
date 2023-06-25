import { ID, Query } from 'appwrite';

import {
  COMMENTS_ID,
  DATABASE_ID,
  databases,
  PROFILES_ID,
} from '@/lib/client-old';

import { Comment } from '@/types/comment';

export const postComment = async (data) => {
  const newComment = await databases.createDocument(
    DATABASE_ID,
    COMMENTS_ID,
    ID.unique(),
    data
  );
  return newComment.$id;
};

export const getCommentsByListingID = async (listingID) => {
  const comments = await databases.listDocuments(DATABASE_ID, COMMENTS_ID, [
    Query.equal('listingID', listingID),
  ]);

  if (comments.total < 1) return [];

  const userIds = comments.documents.map((res) => res.userID);

  const _profiles = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
    Query.equal('$id', userIds),
    //! Query select  issue with appwrite
    // Query.select(['name', 'profile_img', 'profileVerified']),
  ]);

  const commentsWithUsers = comments.documents.map((cmt) => {
    const user: any = _profiles.documents.find((p) => p.$id === cmt.userID);
    const { name, profile_img } = user;
    return { ...cmt, user: { name, profile_img } };
  });

  return commentsWithUsers as Comment[];
};

export const getCommentsByIDs = async (commentIDs) => {
  const comments = await databases.listDocuments(DATABASE_ID, COMMENTS_ID, [
    Query.equal('$id', commentIDs),
  ]);

  if (comments.total < 1) return [];

  const userIds = comments.documents.map((res) => res.userID);

  const _profiles = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
    Query.equal('$id', userIds),
  ]);

  const commentsWithUsers = comments.documents.map((cmt) => {
    const user: any = _profiles.documents.find((p) => p.$id === cmt.userID);
    const { name, profile_img } = user;
    return { ...cmt, user: { name, profile_img } };
  });

  return commentsWithUsers as Comment[];
};
