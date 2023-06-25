import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export const SERVER =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_SERVER
    : process.env.NEXT_PUBLIC_API_SERVER;

const api = axios.create({ baseURL: SERVER });

api.interceptors.request.use(function (config) {
  const token = Cookies.get('token');
  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errRes: any = error.response && error.response?.data;

    //force logout and redirect on unauthorized request
    if (
      window.location.pathname !== '/account/login' &&
      error.response?.status === 401
    ) {
      window.location.href = '/account/logout';
    }

    return Promise.reject(errRes?.error || errRes || 'Server Failure!');
  }
);

export default api;
