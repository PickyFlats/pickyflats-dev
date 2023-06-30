import { Query } from 'appwrite';

import api from '@/lib/api';
import {
  COMMENTS_ID,
  DATABASE_ID,
  databases,
  PROFILES_ID,
} from '@/lib/client-old';

import { Comment } from '@/types/comment';

export const postComment = async (data) => {
  const { data: newComment } = await api.post('/comments/add', data);
  return newComment.$id;
};

export const getCommentsByListingID = async (listingID) => {
  const { data: comments } = await api.get(`/comments/listing/${listingID}`);

  if (comments.total < 1) return [];

  return comments as Comment[];
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

  // return commentsWithUsers as Comment[];
  return [];
};
