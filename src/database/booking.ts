import { ID, Query } from 'appwrite';

import {
  DATABASE_ID,
  databases,
  LISTINGS_ID,
  RESERVATIONS_ID,
} from '@/lib/client-old';

export const createListingReservation = async (data) => {
  const newReservation = await databases.createDocument(
    DATABASE_ID,
    RESERVATIONS_ID,
    ID.unique(),
    data
  );
  return newReservation.$id;
};

export const getReservedListingsForUser = async (userID) => {
  const reservations = await databases.listDocuments(
    DATABASE_ID,
    RESERVATIONS_ID,
    [
      Query.equal('userID', userID),
      // Query.orderAsc('userID'),
      // Query.orderDesc('$createdAt'),
    ]
  );

  const listingsIds = [
    ...new Set(reservations.documents.flatMap((res) => res.listingID)),
  ];

  // find all the reserved listings
  const listings = await databases.listDocuments(DATABASE_ID, LISTINGS_ID, [
    Query.equal('$id', listingsIds),
  ]);

  const reservationsWithListings = reservations.documents.map(
    (reservedListing) => {
      const listing = listings.documents.find(
        (item) => item.$id === reservedListing.listingID
      );
      return { ...reservedListing, listing };
    }
  );

  return reservationsWithListings;
};

export const updateReservationById = async (reservationID, data) => {
  await databases.updateDocument(
    DATABASE_ID,
    RESERVATIONS_ID,
    reservationID,
    data
  );
};

export const getReservationById = async (reservationID) => {
  return await databases.getDocument(
    DATABASE_ID,
    RESERVATIONS_ID,
    reservationID
  );
};
