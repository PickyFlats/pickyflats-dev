import api from '@/lib/api';
import {
  DATABASE_ID,
  databases,
  LISTINGCOSTS_ID,
  LISTINGS_ID,
} from '@/lib/client-old';

export const fetchListingById = async (listingID) => {
  const listingRes = await api.get(`/listings/${listingID}`);
  return listingRes.data;
};

// update listing
export const updateListingById = async (listingID, data) => {
  await api.patch(`/listings/${listingID}`, data);
};

export const updateListingCost = async (listingID, data) => {
  await api.patch(`/listing-costs/listing/${listingID}`, data);
};

// delete
export const deleteListing = async (listingID, listingCostsID) => {
  //FEATURE: update clear galleries image from storage
  await databases.deleteDocument(DATABASE_ID, LISTINGS_ID, listingID);
  await databases.deleteDocument(DATABASE_ID, LISTINGCOSTS_ID, listingCostsID);
};
