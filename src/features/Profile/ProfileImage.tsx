import { Button } from '@mui/material';
import { ID } from 'appwrite';
import React from 'react';

import {
  DATABASE_ID,
  databases,
  PROFILES_BUCKET,
  PROFILES_ID,
  storage,
} from '@/lib/client-old';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

export default function ProfileImage() {
  const { user } = useAuthStore();
  const { openSnackbar } = useSnackbarStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    // Do something with the selected file
    handleUploadProfile(selectedFile);
  };

  const handleUploadProfile = async (profile) => {
    try {
      const a = await storage.createFile(PROFILES_BUCKET, ID.unique(), profile);

      await databases.updateDocument(DATABASE_ID, PROFILES_ID, user!.$id, {
        profile_img: a.$id,
      });
      openSnackbar('Profile updated successfully!');
    } catch (e) {
      openSnackbar('Profile update failed!', 'error');
    }
  };

  const profileAvatar = storage.getFilePreview(
    PROFILES_BUCKET,
    user!.profilePicture
  );
  return (
    <>
      <div className='flex-shrink-0'>
        <div className='bg-primary-light relative inline-flex h-16 w-16 items-center justify-center rounded-full'>
          {profileAvatar ? (
            <img
              src={profileAvatar.href}
              alt='Avatar'
              className='inline-flex h-14 w-14 items-center justify-center rounded-full'
            />
          ) : (
            <span className='text-xl font-bold uppercase text-white'>
              {user?.name.substring(0, 2).toUpperCase()}
            </span>
          )}
          <input
            type='file'
            id='avatar'
            ref={fileInputRef}
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            onChange={handleFileInputChange}
          />
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
        <div>
          <h6>Profile Picture</h6>
          <span className='text-gray-500'>
            We supports PNGs, JPEGs under 10MB
          </span>
        </div>
        <Button
          variant='contained'
          className='mr-auto'
          onClick={handleButtonClick}
        >
          Upload Image
        </Button>
      </div>
    </>
  );
}
