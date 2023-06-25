import { Button as MUIButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';

import api from '@/lib/api';
import clsxm from '@/lib/clsxm';

import AuthLayout from '@/components/layout/AuthLayout';
import Seo from '@/components/Seo';

import withAuth, { WithAuthProps } from '@/hoc/withAuth';

type LoginData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginData>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      setLoginError('');
      setIsLoading(true);

      const loginRes = await api.post('/auth/login', data);
      const { accessToken } = loginRes.data;
      if (accessToken) {
        Cookies.set('token', accessToken);
        // hard refresh on login
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      setLoginError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo templateTitle='Login' />
      <div className='max-w-[400px] p-4'>
        <main className=''>
          <div className='flex'>
            <div className='mx-auto p-4 sm:w-full '>
              <div>
                <h1 className=' text-primary-main text-center text-2xl font-bold leading-[150%]'>
                  Sign In to your account
                </h1>
                <p className='mt-4 text-center text-sm font-medium leading-[150%] text-gray-500'>
                  Please enter your email and password to login to your account.
                </p>
              </div>
              {loginError && (
                <div
                  className='my-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
                  role='alert'
                >
                  {loginError}
                </div>
              )}

              <div className=''>
                <div className='mt-6'>
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className='space-y-6'
                    >
                      <div>
                        {/* <label className='text-sm font-medium leading-[150%]'>
                        Email
                      </label> */}
                        <Controller
                          name='email'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              variant='standard'
                              className=' mt-2 w-full'
                              id='email'
                              placeholder='Email'
                              type='email'
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
                          rules={{
                            required: 'Email is required',
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message:
                                'Entered value does not match email format',
                            },
                          }}
                        />
                      </div>
                      {errors.email && (
                        <div className='text-sm text-red-500'>
                          {errors.email.message}
                        </div>
                      )}

                      <div>
                        {/* <label className='text-sm font-medium leading-[150%]'>
                        Password
                      </label> */}
                        <Controller
                          name='password'
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              variant='standard'
                              className='mt-2 w-full'
                              id='password'
                              placeholder='Password'
                              type={showPassword ? 'text' : 'password'}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position='start'
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                      </div>

                      <div>
                        <MUIButton
                          type='submit'
                          // variant='contained'
                          className={clsxm(
                            'bg-primary-main hover:bg-primary-light w-full text-[16px] font-semibold capitalize text-white',
                            isLoading
                              ? 'relative !text-transparent transition-none hover:text-transparent disabled:cursor-wait'
                              : ''
                          )}
                          disabled={isLoading}
                        >
                          {isLoading && (
                            <div className='absolute left-0 right-0 text-white'>
                              <ImSpinner2 className='animate-spin' />
                            </div>
                          )}
                          Sign In
                        </MUIButton>
                      </div>
                    </form>
                  </FormProvider>
                </div>
                <p className='text-primary-main mt-3 text-center text-sm font-medium leading-[150%]'>
                  <Link href='/auth/forgot-password'>Forgot Password ?</Link>
                </p>
                <p className='mt-4 text-center text-sm text-gray-500'>
                  Don't have an account?
                  <Link
                    href='/auth/register'
                    className='text-primary-main hover:text-primary-light ml-1 font-semibold leading-6'
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function LayoutWrapper(props: WithAuthProps) {
  return <AuthLayout>{props.page}</AuthLayout>;
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'auth'
);
LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
