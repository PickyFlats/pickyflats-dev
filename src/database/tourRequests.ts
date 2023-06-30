import api from '@/lib/api';

import { Listing } from '@/types/listing';
import { User } from '@/types/user';

interface TourInput {
  listingId: string;
  pickedDate: string;
  note: string;
  sellerId?: string;
}

export const createRequestForTour = async (input: TourInput) => {
  const { data } = await api.post('/tour-requests/new', input);
  return data.$id;
};

export interface TourRequest {
  $id: string;
  createdAt: string;
  listingId: string;
  userId: string;
  sellerId: string;
  note: string;
  listing: Listing;
  user: User;
  status: 'draft' | 'accepted';
}

export const getTourRequestsForCurrentSeller = async () => {
  const { data: tourRequests } = await api.get('/tour-requests/me');

  return tourRequests;
  //

  // if (_requests.total < 1) return [];

  // // filter out listing data
  // const listingIds = _requests.documents.map((res) => res.listingID);

  // const _listings = await databases.listDocuments(DATABASE_ID, LISTINGS_ID, [
  //   Query.equal('$id', listingIds),
  // ]);

  // const listingsIds = [
  //   ...new Set(_listings.documents.flatMap((res) => res.$id)),
  // ];

  // const _listingsCosts = await databases.listDocuments(
  //   DATABASE_ID,
  //   LISTINGCOSTS_ID,
  //   [Query.equal('listingID', listingsIds)]
  // );

  // const listingsWithCosts = _listings.documents.map((listing) => {
  //   const listingCosts = _listingsCosts.documents.find(
  //     (item) => item.listingID === listing.$id
  //   );
  //   return { ...listing, costs: listingCosts };
  // });

  // // fetch user data
  // const userIDs = _requests.documents.map((res) => res.userID);
  // const _profiles = await databases.listDocuments(DATABASE_ID, PROFILES_ID, [
  //   Query.equal('$id', userIDs),
  //   // Query.select(['name', 'profile_img', 'profileVerified', 'lastActivity']),
  // ]);

  // return _requests.documents.map((request) => {
  //   const user = _profiles.documents.find(
  //     (profile) => profile.$id === request?.userID
  //   );
  //   const listing = listingsWithCosts.find(
  //     (listing) => listing.$id === request?.listingID
  //   );
  //   return { ...request, user, listing };
  // });
};

export const updateTourRequestById = async (tourRequestID, data) => {
  await api.post(`/tour-requests/${tourRequestID}`, data);
};
