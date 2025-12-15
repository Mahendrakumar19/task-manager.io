import { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks';
import { useSocket } from '../useSocket';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
  assignedToId: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

export function Tasks() {
  useSocket();
  const [filter, setFilter] = useState<any>({});
  const [showCreate, setShowCreate] = useState(false);
  const { data: tasks, isLoading } = useTasks(filter);
  const { data: users } = useQuery(['users'], () => api.getUsers());
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'MEDIUM',
      status: 'TODO',
    },
  });

  const onSubmit = async (data: TaskForm) => {
    await createTask.mutateAsync(data);
    reset();
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
            <a
              href="/dashboard"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      <div className="px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) =>
                setFilter({ ...filter, status: e.target.value || undefined })
              }
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) =>
                setFilter({ ...filter, priority: e.target.value || undefined })
              }
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showCreate ? 'Cancel' : 'Create Task'}
          </button>
        </div>

        {showCreate && (
          <div className="p-6 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Create New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Due Date *
                  </label>
                  <input
                    {...register('dueDate')}
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Assign To
                  </label>
                  <select
                    {...register('assignedToId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Unassigned</option>
                    {users?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {isLoading ? (
              <TaskSkeleton />
            ) : tasks && tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => deleteTask.mutate(task.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500">No tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex p-4 space-x-4 bg-gray-100 rounded animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ task, onDelete }: { task: any; onDelete: () => void }) {
  const updateTask = useUpdateTask();
  
  const priorityColors: any = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  const statusColors: any = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    REVIEW: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateTask.mutateAsync({
      id: task.id,
      data: { status: newStatus },
    });
  };

  return (
    <div className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
              statusColors[task.status]
            }`}
          >
            <option value="TODO">TO DO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <button
            onClick={onDelete}
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      {task.description && (
        <p className="mb-2 text-sm text-gray-600">{task.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        {task.assignee && (
          <span>Assigned: {task.assignee.name || task.assignee.email}</span>
        )}
      </div>
    </div>
  );
}
