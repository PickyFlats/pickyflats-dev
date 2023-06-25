import { Button } from '@mui/material';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { updateCurrentUser } from '@/database/user';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import TextField from '@/features/HookForm/TextField';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
}

export default function ProfileInformationForm() {
  const { user } = useAuthStore();
  const methods = useForm<FormData>({
    defaultValues: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });
  const { control } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbarStore();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await updateCurrentUser({
        firstName: data.firstName,
        lastName: data.lastName,
      }); //
      openSnackbar('Profile updated successfully!');
    } catch (error) {
      openSnackbar('Profile update failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='mb-6 py-2'>
        <h3 className='text-lg font-semibold'>Profile Information</h3>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col max-lg:gap-y-8 lg:flex-row lg:space-x-4'>
            <TextField
              control={control}
              name='email'
              label='Email'
              disabled
              defaultValue='email@pickyflats.com'
              className='!lg:w-1/2 !mt-0 w-full'
            />
            <TextField
              control={control}
              name='firstName'
              label='First Name'
              className='!lg:w-1/2 !mt-0 w-full'
            />
            <TextField
              control={control}
              name='lastName'
              label='Last Name'
              className='!lg:w-1/2 !mt-0 w-full'
            />
          </div>
          <Button
            variant='outlined'
            color='primary'
            type='submit'
            disabled={loading}
          >
            Save
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
