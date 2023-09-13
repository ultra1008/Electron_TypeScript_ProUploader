import { createAction, props } from '@ngrx/store';
import { AppSettings } from './settings.model';

export const loadSettings = createAction(
  '[settings page] loadSettings'
);

export const loadSettingsFailure = createAction(
  '[settings page] loadSettings Failure',
  props<{ error: string }>()
);

export const loadSettingsSuccess = createAction(
  '[settings page] loadSettings Success',
  props<{ settings: AppSettings }>()
);

export const saveSettings = createAction(
  '[settings page] saveSettings',
  props<{ settings: Partial<AppSettings> }>()
);

export const saveSettingsFailure = createAction(
  '[settings page] Save Settings Failure',
  props<{ error: any }>()
);

export const saveSettingsSuccess = createAction(
  '[settings page] Save Settings Success',
  props<{ settings: Partial<AppSettings> }>()
); 
