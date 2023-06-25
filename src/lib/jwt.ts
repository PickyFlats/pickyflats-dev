import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

import axios from './api';

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded: any = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    Cookies.set('token', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    Cookies.remove('token');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
