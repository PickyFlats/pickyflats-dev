'use client';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

import { API_SERVER } from '@/lib/api';

const token = Cookies.get('token');

export const chatIO = io(`${API_SERVER}`, {
  // path: '/chatIO',
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
