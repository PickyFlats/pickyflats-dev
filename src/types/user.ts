export type User = {
  $id: string;
  _id: string;
  firstName: string;
  lastName: string;
  status: boolean;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  prefs: [key: string];
} & UserProfile;

type Role = 'user' | 'seller' | 'admin';
// profiles data
export type UserProfile = {
  roles: Role[];
  profilePicture: string;
  profileVerified: any;
  accountType: string;
  personalInterest: any[];
  referredSource: any[];
  country: string;
  city: string;
  userId: string;
  listenerID: string;
  lastActivity: string;
};
