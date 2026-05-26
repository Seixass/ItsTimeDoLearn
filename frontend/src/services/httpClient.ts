const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export class ApiError extends Error {
  readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
  } catch {
    throw new ApiError('Backend inacessível. Verifique se o servidor está rodando.', 0);
  }

  if (res.status === 204) return undefined as T;

  const body = (await res.json()) as ApiEnvelope<T>;

  if (!res.ok || !body.success) {
    throw new ApiError(body.error ?? 'Erro na requisição', res.status);
  }

  return body.data as T;
}

export const http = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, data: unknown) => request<T>(path, { method: 'POST',  body: JSON.stringify(data) }),
  put:    <T>(path: string, data: unknown) => request<T>(path, { method: 'PUT',   body: JSON.stringify(data) }),
  patch:  <T>(path: string, data: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};
