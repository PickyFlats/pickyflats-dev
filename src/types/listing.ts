import { Iroom } from '@/store/flatStore';

export type Listing = {
  $id: string;
  purpose: 'sell' | 'rent';
  flatTypes: number[];
  buildingAmenities: string[];
  flatAmenities: string[];
  flatPolicies: string[];
  room: number;
  bathroom: number;
  kitchen: number;
  // gallery: string | object;
  gallery: Iroom[];
  sellerCountry: string;
  sellerCity: string;
  sellerEmail: string;
  flatCountry: string;
  flatCity: string;
  flatStreet1: string;
  flatStreet2: string;
  flatGeo: number[];
  userID: string;
  liked_by: string[];
  saved_by: string[];
  sellerContact: any;
  // $createdAt: string;
  // $updatedAt: string;
  costs?: Costs;
};

export interface Costs {
  currency: string;
  negotiable: string;
  purchaseCost: number;
  monthlyCost: number;
  yearlyCost: number;
  mortgagePayments: number;
  utilityCost: number;
  insuranceCost: number;
  propertyTax: number;
  internetCost: number;
  parkingFee: number;
  petFee: number;
  communalFacilityFee: number;
  cleaningFee: number;
  homeImprovement: number;
  furnitureAppliances: number;
  legalFees: number;
  movingCost: number;
  securitySystem: number;
  homeOfficeSetup: number;
  maintenanceRepairs: number;
  otherCost: number;
  listingID: string;

  // $id: string;
  // $createdAt: string;
  // $updatedAt: string;
}
