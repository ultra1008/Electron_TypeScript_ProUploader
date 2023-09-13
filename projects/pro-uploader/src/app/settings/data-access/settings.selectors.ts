import { AppState } from '@app/shared/state/app.state';
import { createSelector } from '@ngrx/store';

export const getAppSettingsState = (state: AppState) => state.settings;

export const selectCurrentSettings = createSelector(
  getAppSettingsState,
  (state) => state.settings
);


