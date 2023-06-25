import api from '@/lib/api';

export const getUserProfileForChat = async (userID) => {
  const profileRes = await api.get(`/profiles/${userID}`);
  return profileRes.data;
};
