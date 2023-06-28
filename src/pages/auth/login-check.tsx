import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ImSpinner8 } from 'react-icons/im';

import api from '@/lib/api';
import { setSession } from '@/lib/jwt';

import useSnackbarStore from '@/store/useSnackbarStore';

import withAuth from '@/hoc/withAuth';

// login check - used for login using passage

export default function LoginCheckPage() {
  const { push } = useRouter();
  const { openSnackbar } = useSnackbarStore();
  const loginUsingPassage = async () => {
    try {
      const { data } = await api.post('/auth/login/passage');
      Cookies.set('token', data?.accessToken);
      // + hard refresh on login
      window.location.href = '/dashboard';
    } catch (error) {
      localStorage.removeItem('psg_auth_token');
      openSnackbar('Invalid login attempt', 'error');
      push('/auth/login');
    }
  };
  useEffect(() => {
    // check if session using passageID
    const passageAuthToken = localStorage.getItem('psg_auth_token');
    if (!passageAuthToken) {
      push('/auth/login');
    }

    setSession(passageAuthToken);
    loginUsingPassage();
  }, []);
  return (
    <div className='flex min-h-screen flex-col items-center justify-center text-gray-800'>
      <div className='relative mx-auto mb-2 h-[40px] w-[200px] object-scale-down'>
        <Image src='/logo.svg' alt='logo' fill />
      </div>
      <ImSpinner8 className='my-4 animate-spin text-4xl' />
    </div>
  );
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LoginCheckPage,
  'auth'
);

LoginCheckPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};
