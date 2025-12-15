import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      socket = io(API_URL, {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('task:created', () => {
        queryClient.invalidateQueries(['tasks']);
      });

      socket.on('task:updated', () => {
        queryClient.invalidateQueries(['tasks']);
      });

      socket.on('task:deleted', () => {
        queryClient.invalidateQueries(['tasks']);
      });

      socket.on('task:assigned', () => {
        queryClient.invalidateQueries(['tasks']);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [queryClient]);

  return socket;
}
