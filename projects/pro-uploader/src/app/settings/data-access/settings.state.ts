import { AppSettings, AppSettingsStatus } from './settings.model';

export interface AppSettingsState {
  status: AppSettingsStatus;
  settings: AppSettings;
}

export const initialState: AppSettingsState = {
  settings: null,
  status: 'pending'
};
