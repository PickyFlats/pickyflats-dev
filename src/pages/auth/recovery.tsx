import { Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BiHide, BiShow } from 'react-icons/bi';
import { ImSpinner2 } from 'react-icons/im';

import { account } from '@/lib/client-old';
import clsxm from '@/lib/clsxm';

import AuthLayout from '@/components/layout/AuthLayout';
import Seo from '@/components/Seo';

import useSnackbarStore from '@/store/useSnackbarStore';

type formData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { userId, secret: resetSecret } = router.query;
  const { openSnackbar } = useSnackbarStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      await account.updateRecovery(
        userId!.toString(),
        resetSecret!.toString(),
        data.password,
        data.confirmPassword
      );
      openSnackbar(
        'Password reset is complete. Please login using your new password.',
        'success'
      );
      router.push('/login');
    } catch (error: any) {
      setFormError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo templateTitle='Password Recovery' />
      <div className='  flex flex-col p-4  md:w-[400px] '>
        <h1 className='text-primary-main mt-4 text-center text-2xl font-bold leading-[150%]'>
          Password Reset
        </h1>

        <p className='mt-4 block text-center text-sm font-medium leading-[150%] text-gray-500  '>
          Enter new password and then repeat it
        </p>

        {formError && (
          <div
            className='my-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
            role='alert'
          >
            {formError}
          </div>
        )}

        <div className='mt-4 flex '>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    variant='standard'
                    {...field}
                    className='mt-2 w-full'
                    id='password'
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position='start'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <BiHide
                              style={{
                                color: '#9CA3AF',
                                fontSize: '1.25rem',
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <BiShow
                              style={{
                                color: '#9CA3AF',
                                fontSize: '1.25rem',
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <div className='mb-6 mt-4'>
                <Controller
                  name='confirmPassword'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      variant='standard'
                      {...field}
                      className='w-full'
                      id='confirmPassword'
                      placeholder='Confirm Password'
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position='start'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <BiHide
                                style={{
                                  color: '#9CA3AF',
                                  fontSize: '1.25rem',
                                  cursor: 'pointer',
                                }}
                              />
                            ) : (
                              <BiShow
                                style={{
                                  color: '#9CA3AF',
                                  fontSize: '1.25rem',
                                  cursor: 'pointer',
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <Button
                className={clsxm(
                  'bg-primary-main hover:bg-primary-light mx-auto my-4 block w-full py-3 text-center font-semibold capitalize text-white hover:text-white',
                  isLoading ? '!text-transparent' : ''
                )}
                type='submit'
                disabled={isLoading}
              >
                {isLoading && (
                  <div className='absolute left-0 right-0 text-white'>
                    <ImSpinner2 className='animate-spin' />
                  </div>
                )}
                Save
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

// TODO: redirect to main on ssr load, if no userID & secret
