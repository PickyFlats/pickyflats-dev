export interface Comment {
  listingID: string;
  userID: string;
  text: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  user?: {
    firstName: string;
    lastName: string;
    profilePicture: any;
  };
}
