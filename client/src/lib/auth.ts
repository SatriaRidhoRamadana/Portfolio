import { apiRequest } from "./queryClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  return response.json();
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await fetch("/api/auth/verify", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return true;
  } catch {
    return false;
  }
}
