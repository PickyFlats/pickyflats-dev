import { Account, Client, Databases, Functions, Storage } from 'appwrite';

import { appwriteConfig } from '@/lib/config';

// const ENV_MODE: APPWRITE_ENV_MODE = (process.env.NEXT_PUBLIC_APPWRITE_MODE ||
//   'CLOUD') as APPWRITE_ENV_MODE;
const ENV_MODE = 'CLOUD';

export const client = new Client();
// .setEndpoint(appwriteConfig[ENV_MODE].API_ENDPOINT!) // APPWRITE API Endpoint
// .setProject(appwriteConfig[ENV_MODE].PROJECT_ID!); // APPWRITE project ID

export const account = new Account(client);

export const databases = new Databases(client);
export const DATABASE_ID =
  appwriteConfig[ENV_MODE].DATABASE_ID || 'pickyflats_web';

//table IDs
export const LISTINGS_ID =
  appwriteConfig[ENV_MODE].collections.LISTINGS_ID || 'listings';

export const COMMENTS_ID =
  appwriteConfig[ENV_MODE].collections.COMMENTS_ID || 'comments';

export const LISTINGCOSTS_ID =
  appwriteConfig[ENV_MODE].collections.LISTINGCOSTS_ID || 'listingCosts';

export const CONVERSATIONS_ID =
  appwriteConfig[ENV_MODE].collections.CONVERSATIONS_ID || 'conversations';

export const MESSAGES_ID =
  appwriteConfig[ENV_MODE].collections.MESSAGES_ID || 'messages';

export const LISTENERS_ID =
  appwriteConfig[ENV_MODE].collections.LISTENERS_ID || 'listeners';

export const PROFILES_ID =
  appwriteConfig[ENV_MODE].collections.PROFILES_ID || 'profiles';
export const VERIFICATIONS_ID =
  appwriteConfig[ENV_MODE].collections.LISTENERS_ID || 'verificationRequests';
export const NOTIFICATIONS_ID =
  appwriteConfig[ENV_MODE].collections.NOTIFICATIONS_ID || 'notifications';
export const TOURREQUESTS_ID =
  appwriteConfig[ENV_MODE].collections.TOURREQUESTS_ID || 'tourRequests';
export const RESERVATIONS_ID =
  appwriteConfig[ENV_MODE].collections.RESERVATIONS_ID || 'reservations';

export const storage = new Storage(client);

export const LISTINGS_BUCKET =
  appwriteConfig[ENV_MODE].buckets.listings || 'listings';
export const PROFILES_BUCKET =
  appwriteConfig[ENV_MODE].buckets.profiles || 'profiles';
export const MESSAGES_BUCKET =
  appwriteConfig[ENV_MODE].buckets.messages || 'messages';
export const CONTENT_BUCKET =
  appwriteConfig[ENV_MODE].buckets.content || 'content';

// functions
export const functions = new Functions(client);

export const APP_URL =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3000'
    : 'https://pickyflats.vercel.app';
