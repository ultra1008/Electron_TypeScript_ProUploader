import { FileUpload } from '@app/uploads/data-access/upload.model';
import { createAction, props } from '@ngrx/store';
import { OrderUpload } from 'pfshared/pfapi';

// [orders page]

export const addOrderUpload = createAction(
  '[orders page] Add OrderUpload',
  props<{ orderUpload: OrderUpload, upload: boolean }>()
);

export const addOrderUploadFailure = createAction(
  '[orders page] Add OrderUpload Failure',
  props<{ error: any }>()
);

export const addOrderUploadSuccess = createAction(
  '[orders page] Add OrderUpload Success',
  props<{ orderUpload: OrderUpload, upload: boolean }>()
);

export const cancelOrderUpload = createAction(
  '[orders page] Cancel OrderUpload',
  props<{ orderUpload: OrderUpload, retry?: boolean }>()
);

export const cancelOrderUploadSuccess = createAction(
  '[orders page] Cancel OrderUpload Success',
  props<{ orderUpload: OrderUpload }>()
);

export const deleteOrderUpload = createAction(
  '[orders page] Delete OrderUpload',
  props<{ orderUpload: OrderUpload }>()
);

export const deleteOrderUploadSuccess = createAction(
  '[orders page] Delete OrderUpload Success',
  props<{ orderUpload: OrderUpload }>()
);

export const deleteOrderUploadFailure = createAction(
  '[orders page] Delete OrderUpload Failure',
  props<{ error: any, orderUpload: OrderUpload }>()
);

export const loadOrderUploads = createAction(
  '[orders page] Load OrderUploads'
);

export const loadOrderUploadsFailure = createAction(
  '[orders page] Load OrderUploads Failure',
  props<{ error: any }>()
);

export const loadOrderUploadsSuccess = createAction(
  '[orders page] Load OrderUploads Success',
  props<{ orderUploads: OrderUpload[] }>()
);

export const processOrderUpload = createAction(
  '[orders page] Process OrderUpload',
  props<{ orderUpload: OrderUpload }>()
);

export const processOrderUploadFailure = createAction(
  '[orders page] ProcessOrderUpload Failure',
  props<{ error: any }>()
);  

export const processOrderUploadSuccess = createAction(
  '[orders page] Process OrderUpload Success',
  props<{ orderUpload: OrderUpload }>()
);

export const refreshOrderUploads = createAction(
  '[orders page] Refresh OrderUploads'
);

export const retryOrderUpload = createAction(
  '[orders page] Retry Order Upload',
  props<{ orderUpload: OrderUpload }>()
);  

// [order details page]

export const editOrderUploadComplete = createAction(
  '[orders details page] Edit OrderUpload Complete',
  props<{ orderUpload: OrderUpload }>()
);

export const updateOrderUpload = createAction(
  '[orders details page] Update OrderUpload',
  props<{ orderUpload: OrderUpload, upload: boolean }>()
);

export const updateOrderUploadFailure = createAction(
  '[orders details page] Update OrderUpload Failure',
  props<{ error: any, orderUpload: OrderUpload }>()
);

export const updateOrderUploadSuccess = createAction(
  '[orders details page] Update OrderUpload Success',
  props<{ orderUpload: OrderUpload, upload: boolean }>()
); 

// [uploads page]

export const cancelFileUpload = createAction(
  '[uploads page] Cancel File Upload',
  props<{ fileUpload: FileUpload }>()
);  

export const updateFileUploadProgress = createAction(
  '[uploads page] Update File Upload Progress',
  props<{ fileUpload: FileUpload }>()
);  

// [upload service]

export const markOrderUploadComplete = createAction(
  '[upload service] MarkOrderUploadComplete',
  props<{ orderUpload: OrderUpload }>()
);  

export const markOrderUploadCompleteFailure = createAction(
  '[upload service] MarkOrderUploadComplete Failure',
  props<{ error: any }>()
);  

export const markOrderUploadCompleteSuccess = createAction(
  '[upload service] MarkOrderUploadComplete Success',
  props<{ orderUpload: OrderUpload }>()
);  

export const sendOrderUploadEmail = createAction(
  '[upload service] SendOrderUploadEmail',
  props<{ orderUpload: OrderUpload }>()
);  

export const sendOrderUploadEmailFailure = createAction(
  '[upload service] SendOrderUploadEmail Failure',
  props<{ error: any }>()
);  

export const sendOrderUploadEmailSuccess = createAction(
  '[upload service] SendOrderUploadEmail Success',
  props<{ orderUpload: OrderUpload }>()
);  
