interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  reason?: 'token_expired' | 'no_token';
}
