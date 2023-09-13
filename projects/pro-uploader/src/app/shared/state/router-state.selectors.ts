import { AppState } from './app.state';
import { createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router-state-serializer';

export const getRouterState = (state: AppState) => state.router;

export const selectCurrentRouterState = createSelector(
  getRouterState,
  (state: RouterReducerState<RouterStateUrl>) => state.state
);
