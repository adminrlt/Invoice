export interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department_id: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  name: string;
  email: string;
  file_urls: string[];
  created_at: string;
}

export interface Profile {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: any;
  profile?: Profile;
}

export type AuthMode = 'login' | 'signup' | 'forgot';