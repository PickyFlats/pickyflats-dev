import { ID, Query } from 'appwrite';

import {
  DATABASE_ID,
  databases,
  LISTINGCOSTS_ID,
  LISTINGS_ID,
  PROFILES_ID,
  TOURREQUESTS_ID,
} from '@/lib/client-old';

import { Listing } from '@/types/listing';
import { User } from '@/types/user';

interface TourInput {
  userID: string;
  listingID: string;
  pickedDate: string;
  note: string;
  sellerID?: string;
}

export const createRequestForTour = async (input: TourInput) => {
  const tourRequest = await databases.createDocument(
    DATABASE_ID,
    TOURREQUESTS_ID,
    ID.unique(),
    input
  );
  return tourRequest.$id;
};
export interface TourRequest {
  $id: string;
  $createdAt: string;
  listingID: string;
  userID: string;
  sellerID: string;
  note: string;
  listing: Listing;
  user: User;
  status: 'draft' | 'accepted';
}

export const getTourRequestsForSeller = async (sellerID) => {
  const _requests = await databases.listDocuments(
    DATABASE_ID,
    TOURREQUESTS_ID,
    [Query.equal('sellerID', sellerID)]
  );

  //

  if (_requests.total < 1) return [];

  // filter out listing data
  const listingIds = _requests.documents.map((res) => res.listingID);

  const _listings = await databases.listDocuments(DATABASE_ID, LISTINGS_ID, [
    Query.equal('$id', listingIds),
  ]);

  const listingsIds = [
    ...new Set(_listings.documents.flatMap((res) => res.$id)),
  ];

  const _listingsCosts = await databases.listDocuments(
    DATABASE_ID,
    LISTINGCOSTS_ID,
    [Query.equal('listingID', listingsIds)]
  );

  const listingsWithCosts = _listings.documents.map((listing) => {
    const listingCosts = _listingsCosts.documents.find(
      (item) => item.listingID === listing.$id
    );
    return { ...listing, costs: listingCosts };
  });

  // fetch user data
  const userIDs = _requests.documents.map((res) => res.userID);
  const _profiles = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
    Query.equal('$id', userIDs),
    // Query.select(['name', 'profile_img', 'profileVerified', 'lastActivity']),
  ]);

  return _requests.documents.map((request) => {
    const user = _profiles.documents.find(
      (profile) => profile.$id === request?.userID
    );
    const listing = listingsWithCosts.find(
      (listing) => listing.$id === request?.listingID
    );
    return { ...request, user, listing };
  });
};

export const updateTourRequestById = async (tourRequestID, data) => {
  await databases.updateDocument(
    DATABASE_ID,
    TOURREQUESTS_ID,
    tourRequestID,
    data
  );
};
