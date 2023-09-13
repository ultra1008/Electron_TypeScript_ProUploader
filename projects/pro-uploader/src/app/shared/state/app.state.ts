import { ActionReducerMap } from '@ngrx/store';
import { AuthEffects } from '@app/home/data-access/auth.effects';
import { authReducer } from '@app/home/data-access/auth.reducer';
import { AuthState } from '@app/home/data-access/auth.state';
import { OrderUploadEffects } from '@app/orders/data-access/order-upload.effects';
import { orderUploadReducer } from '@app/orders/data-access/order-upload.reducer';
import { OrderUploadState } from '@app/orders/data-access/order-upload.state';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router-state-serializer';
import { AppSettingsEffects } from '@app/settings/data-access/settings.effects';
import { appSettingsReducer } from '@app/settings/data-access/settings.reducer';
import { AppSettingsState } from '@app/settings/data-access/settings.state';

export interface AppState {
  auth: AuthState;
  orderUploads: OrderUploadState;
  router: RouterReducerState<RouterStateUrl>;
  settings: AppSettingsState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  orderUploads: orderUploadReducer,
  router: routerReducer,
  settings: appSettingsReducer
};

export const effects = [
  AuthEffects,
  OrderUploadEffects,
  AppSettingsEffects
];


