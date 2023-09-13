import { User } from './user.model';
import { createAction, props } from '@ngrx/store';
import { LoginCredentials } from './login.model';

export const autoLogin = createAction(
  '[auth page] auto login'
);

export const login = createAction(
  '[home page] login',
  props<{ credentials: LoginCredentials }>()
);

export const loginFailure = createAction(
  '[home page] login Failure',
  props<{ error: any, quiet?: boolean }>()
);

export const loginSuccess = createAction(
  '[home page] login Success',
  props<{ user: User; redirect?: boolean }>()
);

export const logout = createAction(
  '[auth page] logout'
);
