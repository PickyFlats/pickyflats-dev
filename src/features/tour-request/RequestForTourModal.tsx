import { Button, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { functions } from '@/lib/client-old';

import { createRequestForTour } from '@/database/tourRequests';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

interface FormDataType {
  date: string;
  note: string;
}

interface ModalProps {
  // open?: boolean;
  onClose: () => void;
  listingID?: string;
  sellerID?: string;
}

export default function RequestForTourModal({
  sellerID,
  listingID,
  onClose,
}: ModalProps) {
  const methods = useForm<FormDataType>();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbarStore();

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormDataType) => {
    try {
      setLoading(true);
      const newTourID = await createRequestForTour({
        userID: user!.$id,
        listingID: listingID!,
        pickedDate: data.date,
        note: data.note,
        sellerID: sellerID,
      });
      await functions.createExecution(
        'tourNotification',
        JSON.stringify({ tourID: newTourID })
      );
      onClose();
      openSnackbar('Your tour request has been sent successfully!');
    } catch (error) {
      openSnackbar('Request creation failed', 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full max-w-lg max-md:w-[300px]'>
      <div className='modal-container'>
        <h2 className=' text-primary-main text-2xl font-semibold'>
          Request for Tour
        </h2>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-6 space-y-4'>
            <Controller
              name='date'
              defaultValue=''
              rules={{ required: 'Please enter a date' }}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label='Choose Date'
                  className='w-full'
                  // defaultValue={dayjs('2023-06-17T15:30')}
                />
              )}
            />

            <Controller
              name='note'
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Notes'
                  variant='outlined'
                  fullWidth
                  multiline
                  minRows={4}
                />
              )}
            />

            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={loading}
            >
              Send Request
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
