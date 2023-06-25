import { Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { HiOutlineMail } from 'react-icons/hi';

import { account } from '@/lib/client-old';
import withAppURL from '@/lib/url';

import AuthLayout from '@/components/layout/AuthLayout';
import Seo from '@/components/Seo';

import useSnackbarStore from '@/store/useSnackbarStore';

type formData = {
  email: string;
};

const ForgotPasswordPage = () => {
  const { openSnackbar } = useSnackbarStore();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const methods = useForm<formData>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });
  const { handleSubmit, control } = methods;
  const onSubmit: SubmitHandler<formData> = async (data) => {
    setFormError('');
    try {
      setIsLoading(true);
      await account.createRecovery(data.email, withAppURL('/auth/recovery'));
      setEmailSent(true);
    } catch (error: any) {
      setFormError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo templateTitle='Forgot Password?' />
      <div className='  flex max-w-[400px] flex-col  p-4 '>
        <h1 className='text-primary-main mt-4 text-center text-2xl font-bold leading-[150%]'>
          {emailSent ? 'Check your mail' : 'Forgot Password'}
        </h1>

        <p className='mt-4 block text-center text-sm font-medium leading-[150%] text-gray-500  '>
          {emailSent
            ? 'We have sent a password recover instructions to your email.'
            : 'We will send you a link to your email to reset your password.'}
        </p>

        {!emailSent && (
          <div className='mt-4 flex '>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='mt-2 w-full'
                      variant='standard'
                      id='email'
                      placeholder='Email'
                      type='email'
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='start'>
                            <HiOutlineMail
                              style={{
                                color: '#9CA3AF',
                                fontSize: '1.25rem',
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

                <Button
                  className='bg-primary-main hover:bg-primary-light mx-auto my-4 block w-full py-3 text-center
            font-semibold capitalize text-white hover:text-white
            '
                  type='submit'
                >
                  Continue
                </Button>
              </form>
            </FormProvider>
          </div>
        )}
        <div className='my-4 flex flex-col items-center justify-center'>
          <p className='text-center text-sm text-gray-500'>
            <Link
              href='/auth/login'
              className='text-primary-main hover:text-primary-light ml-1 font-semibold leading-6'
            >
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
