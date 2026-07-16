export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string; // Added to match backend
  token: string;
}
