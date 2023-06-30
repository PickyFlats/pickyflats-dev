import api from '@/lib/api';

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
export const deleteListing = async (listingID) => {
  await api.delete(`/listings/${listingID}`);
};
