const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = {
  // Auth
  register: async (email: string, password: string, name?: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/api/v1/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API_URL}/api/v1/auth/users`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Tasks
  getTasks: async (filter?: { status?: string; priority?: string; creatorId?: string; assignedToId?: string }) => {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.priority) params.append('priority', filter.priority);
    if (filter?.creatorId) params.append('creatorId', filter.creatorId);
    if (filter?.assignedToId) params.append('assignedToId', filter.assignedToId);
    const res = await fetch(`${API_URL}/api/v1/tasks?${params}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getTask: async (id: string) => {
    const res = await fetch(`${API_URL}/api/v1/tasks/${id}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  createTask: async (data: any) => {
    const res = await fetch(`${API_URL}/api/v1/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  updateTask: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/api/v1/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  deleteTask: async (id: string) => {
    const res = await fetch(`${API_URL}/api/v1/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text());
  },
};
