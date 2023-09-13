import { LoginStatus } from './login.model';
import { User } from './user.model';

export interface AuthState {
  status: LoginStatus;
  user: User | null;
}

export const initialState: AuthState = {
  status: 'pending',
  user: null
};
