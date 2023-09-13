export interface LoginCredentials {
  dealerCode: string;
  username: string;
  password: string;
  rememberMe: boolean;
}

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';
