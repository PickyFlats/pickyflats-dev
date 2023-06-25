import { Button } from '@mui/material';
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
import { BiHide, BiShow } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';
import { MdOutlinePersonOutline } from 'react-icons/md';

import api from '@/lib/api';
import clsxm from '@/lib/clsxm';

import AuthLayout from '@/components/layout/AuthLayout';
import Seo from '@/components/Seo';

import withAuth, { WithAuthProps } from '@/hoc/withAuth';

type formData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm<formData>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      confirmPassword: '',
    },
  });
  const { handleSubmit, control } = methods;
  const onSubmit: SubmitHandler<formData> = async (data) => {
    setFormError('');
    if (data.password !== data.confirmPassword) {
      setFormError("Confirm password doesn't match");
      return;
    }

    try {
      setIsLoading(true);

      const registerRes = await api.post('/auth/register', data);

      const { accessToken } = registerRes.data;
      if (accessToken) {
        Cookies.set('token', accessToken);
      }

      // create listener for notification & message updates
      // await createListener(user.$id);

      // hard refresh
      window.location.href = '/onboarding';
    } catch (error: any) {
      setFormError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo templateTitle='Register' />
      <div className='flex  max-w-[375px] flex-col  p-4 '>
        <h1 className='text-primary-main mt-4 text-center text-2xl font-bold leading-[150%]'>
          Register
        </h1>

        {formError && (
          <div
            className='my-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
            role='alert'
          >
            {formError}
          </div>
        )}

        <div className='flex  '>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
              {/* <label className='mb-2 text-sm font-medium leading-[150%]'>
              Email
            </label> */}
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant='standard'
                    className='mt-2 w-full'
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
              />
              <div className='my-4 flex flex-col gap-4 sm:flex-row'>
                <div className='flex w-full flex-col'>
                  {/* <label className='mb-2 text-sm font-medium leading-[150%]'>
                  First Name
                </label> */}
                  <Controller
                    name='firstName'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        variant='standard'
                        {...field}
                        className='mt-2 '
                        id='firstName'
                        placeholder='First Name'
                        type='text'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='start'>
                              <MdOutlinePersonOutline
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
                </div>
                <div className='flex w-full flex-col'>
                  {/* <label className='mb-2 text-sm font-medium leading-[150%]'>
                  Last Name
                </label> */}
                  <Controller
                    name='lastName'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        variant='standard'
                        {...field}
                        className='mt-2 '
                        id='lastName'
                        placeholder='Last Name'
                        type='text'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='start'>
                              <MdOutlinePersonOutline
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
                </div>
              </div>

              {/* <label className='my-2 text-sm font-medium leading-[150%]'>
              Password
            </label> */}

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

              <div className='mt-4'>
                {/* <label className=' text-sm font-medium leading-[150%]'>
                Confirm Password
              </label> */}
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
                Sign Up
              </Button>
            </form>
          </FormProvider>
        </div>
        <div className='my-4 flex flex-col items-center justify-center'>
          <p className='text-center text-sm text-gray-500'>
            Already have an account?
            <Link
              href='/auth/login'
              className='text-primary-main hover:text-primary-light ml-1 font-semibold leading-6'
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

function LayoutWrapper(props: WithAuthProps) {
  return <AuthLayout>{props.page}</AuthLayout>;
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'auth'
);
RegisterPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
