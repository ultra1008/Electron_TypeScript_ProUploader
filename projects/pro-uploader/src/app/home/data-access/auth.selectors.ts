import { AppState } from '@app/shared/state/app.state';
import { createSelector } from '@ngrx/store';

export const getAuthState = (state: AppState) => state.auth;

export const isAuthenticated = createSelector(
  getAuthState,
  (state) => state.user ? true : false
);

export const selectAuthStatus = createSelector(
  getAuthState, 
  state => state.status
);

export const isPending = createSelector(
  selectAuthStatus, 
  status => status == 'pending'
);
