import { Query } from 'appwrite';

import api from '@/lib/api';
import { DATABASE_ID, databases, LISTINGCOSTS_ID } from '@/lib/client-old';

import { LISTINGS_ID } from '../lib/client-old';

import { Listing } from '@/types/listing';

export const fetchMyListings = async () => {
  const listingsRes = await api.get('/listings/me');
  return listingsRes.data;
};

interface ListingFetchProps {
  byFlatType?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}
//! TODO: fetch by recent & flat type
export const fetchListings = async (props?: ListingFetchProps) => {
  const _listings = await databases.listDocuments(DATABASE_ID, LISTINGS_ID, [
    Query.equal('isListed', true),
    // Query.equal('userID', [userID]),
    // ...(props?.byFlatType
    //   ? [Query.equal('flatTypes', props.byFlatType as any)]
    //   : []),
    //! Query issue with integer data
    // Query.equal('flatTypes', 8), // ! try on production
    // Query.equal('flatTypes', [8]), // ! try on production
    // Query.equal('flatTypes', activeTypeFilter)

    // TODO: !query on listingsCosts
    // ...(props?.minPrice && props.maxPrice
    //   ? [Query.between('monthlyCost', props.minPrice, props.maxPrice)]
    //   : []),

    // ...(props?.bedrooms ? [Query.equal('room', props.bedrooms)] : []),
    // ...(props?.bathrooms ? [Query.equal('bathrooms', props.bathrooms)] : []),
  ]);

  const listingsIds = [
    ...new Set(_listings.documents.flatMap((res) => res.$id)),
  ];

  // fetch all listing costs
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

export const fetchListingsByUserId = async (userID) => {
  const _listings = await databases.listDocuments(DATABASE_ID, LISTINGS_ID, [
    Query.equal('userID', userID),
    // Query.equal('userID', [userID]),
    // Query.search('userID', userID), // ! try on production
  ]);

  if (_listings.total < 1) return [];

  const listingsIds = [
    ...new Set(_listings.documents.flatMap((res) => res.$id)),
  ];

  // fetch all listing costs
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

export const createListing = async (data) => {
  const listingRes = await api.post('/listings/new', data);
  return listingRes.data?.id;
};

export const saveListingCost = async (data) => {
  await api.post('/listing-costs/new', data);
};
