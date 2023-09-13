import moment from 'moment';
import { AppState } from '@app/shared/state/app.state';
import { createSelector } from '@ngrx/store';
import { selectCurrentSettings } from '@app/settings/data-access/settings.selectors';
import { UploadStatus } from 'pfshared/pfapi';

export const getOrderUploadState = (state: AppState) => state.orderUploads;

export const selectAllOrderUploads = createSelector(
  getOrderUploadState,
  (state) => state.orderUploads
);

export const selectActiveOrderUploads = createSelector(
  selectAllOrderUploads,
  (orderUploads) => orderUploads.filter(o => o.status != UploadStatus.Pending && o.status != UploadStatus.Complete)
);

export const selectPendingOrderUploads = createSelector(
  selectAllOrderUploads,
  (orderUploads) => orderUploads.filter(o => o.status == UploadStatus.Pending && o.idOrder > 0)
);

export const selectRecentOrderUploads = createSelector(
  selectAllOrderUploads,
  selectCurrentSettings,
  (orderUploads, settings) => {
    let filtered = orderUploads.filter(o => o.status == UploadStatus.Complete);

    // only show order uploads from less than "X" days ago
    // if (settings.general.maxAge > 0) {
    //   let min = moment.utc().subtract(settings.general.maxAge, "days");
    //
    //   filtered = filtered.filter(o => {
    //     return moment(o.DateUploadedUtc).isBefore(min) ? false : true;
    //   });
    // }

    return filtered;
  }
);

export const selectOrderUploadsStatus = createSelector(
  getOrderUploadState,
  state => state.status
);

export const isLoading = createSelector(
  selectOrderUploadsStatus,
  status => status == 'loading'
);

export const selectOrderUploadsError = createSelector(
  getOrderUploadState,
  state => state.error
);
