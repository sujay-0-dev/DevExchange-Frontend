import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://devexchange.onrender.com';

export const socket = io(URL, {
  autoConnect: false,
});
