import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
const SERVER = 'http://localhost:3000/';

const token = Cookies.get('token');

export const chatIO = io(SERVER, {
  path: '/chatIO',
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
