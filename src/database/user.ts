import api from '@/lib/api';

export const updateCurrentUser = async (data) => {
  await api.patch('/users/me', data);
};

export const updateCurrentUserProfile = async (data) => {
  await api.patch('/profiles/me', data);
};

export const updateUserProfileById = async (userID, data) => {
  // await api.patch('/profiles/me', data);
};
