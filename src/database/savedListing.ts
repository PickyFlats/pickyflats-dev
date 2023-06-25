import { Query } from 'appwrite';

import {
  DATABASE_ID,
  databases,
  LISTINGCOSTS_ID,
  LISTINGS_ID,
} from '@/lib/client-old';

import { Listing } from '@/types/listing';

export const getSavedListingsByUserId = async (userID) => {
  const _listings = await databases.listDocuments<Listing>(
    DATABASE_ID,
    LISTINGS_ID,
    [Query.search('saved_by', userID)]
  );

  if (_listings.total < 1) return [];

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

  return listingsWithCosts as Listing[];
};
