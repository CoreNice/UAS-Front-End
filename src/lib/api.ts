const API_URL = import.meta.env.VITE_API_URL;

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  token?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const api = async <T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers = {}, body, token } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        error: data.error,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Network error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default api;

export const profileCMSApi = {
  getAll: (token?: string | null) =>
    api('/profile-cms', { token }),

  getById: (id: string, token?: string | null) =>
    api(`/profile-cms/${id}`, { token }),

  create: (data: Record<string, unknown>, token?: string | null) =>
    api('/admin/profile-cms', { method: 'POST', body: data, token }),

  update: (id: string, data: Record<string, unknown>, token?: string | null) =>
    api(`/admin/profile-cms/${id}`, { method: 'POST', body: data, token }),

  delete: (id: string, token?: string | null) =>
    api(`/admin/profile-cms/${id}`, { method: 'DELETE', token }),
};
