import { Comment } from '@/types/comment';
import { Listing } from '@/types/listing';
import { User } from '@/types/user';

export interface Notification {
  type: 'like' | 'tour_requested' | 'tour_accepted' | 'commented';
  listingId: string;
  userID: string;
  commentId?: string;
  likedUserID?: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  listing: Listing;
  comment?: Comment;
  profile?: User;
}
