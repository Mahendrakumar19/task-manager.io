import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

export function useTasks(filter?: any) {
  return useQuery(['tasks', filter], () => api.getTasks(filter));
}

export function useTask(id: string) {
  return useQuery(['tasks', id], () => api.getTask(id), {
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation((data: any) => api.createTask(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: any }) => api.updateTask(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    }
  );
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => api.deleteTask(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });
}
