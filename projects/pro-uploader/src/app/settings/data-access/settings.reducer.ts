import { loadSettingsSuccess, loadSettingsFailure, saveSettingsSuccess } from './settings.actions';
import { createReducer, on } from '@ngrx/store';
import { initialState } from './settings.state';
import { SettingsService } from './settings.service';

export const appSettingsReducer = createReducer(
  initialState,

  on(loadSettingsFailure, (state) => ({
    ...state,
    status: 'success',
    settings: SettingsService.defaults,
  })),

  on(loadSettingsSuccess, (state, action) => ({
    ...state,
    status: 'success',
    settings: action.settings,
  })),

  on(saveSettingsSuccess, (state, action) => ({
    ...state,
    settings: {
      ...state.settings,
      ...action.settings
    }
  }))
);
