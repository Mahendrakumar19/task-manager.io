import { useTasks } from '../hooks';
import { useSocket } from '../useSocket';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function Dashboard() {
  useSocket();
  const { data: user } = useQuery(['me'], () => api.getMe());
  const { data: myTasks, isLoading: myTasksLoading } = useTasks({
    assignedToId: user?.id,
  });
  const { data: createdTasks, isLoading: createdTasksLoading } = useTasks({
    creatorId: user?.id,
  });

  const now = new Date();
  const overdueTasks = myTasks?.filter(
    (task: any) => new Date(task.dueDate) < now && task.status !== 'COMPLETED'
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
            <div className="flex gap-4">
              <a
                href="/tasks"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                All Tasks
              </a>
              <span className="text-gray-600">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome, {user.name || user.email}!
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Assigned to Me
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {myTasksLoading ? '...' : myTasks?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Created by Me
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {createdTasksLoading ? '...' : createdTasks?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Overdue</h3>
            <p className="text-3xl font-bold text-red-600">
              {myTasksLoading ? '...' : overdueTasks?.length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">My Tasks</h3>
          </div>
          <div className="p-6">
            {myTasksLoading ? (
              <TaskSkeleton />
            ) : myTasks && myTasks.length > 0 ? (
              <div className="space-y-3">
                {myTasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tasks assigned to you.</p>
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
        <div key={i} className="animate-pulse flex space-x-4 p-4 bg-gray-100 rounded">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      {task.description && (
        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
      )}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        {task.creator && <span>By: {task.creator.name || task.creator.email}</span>}
      </div>
    </div>
  );
}
