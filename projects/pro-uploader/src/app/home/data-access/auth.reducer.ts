import { login, loginSuccess, logout } from './auth.actions';
import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,

  on(login, (state) => ({
    ...state,
    status: 'authenticating'
  })),

  on(loginSuccess, (state, action) => ({
    ...state,
    status: 'success',
    user: action.user,
  })),

  on(logout, (state) => {
    return {
      ...state,
      user: null,
    };
  })
);
