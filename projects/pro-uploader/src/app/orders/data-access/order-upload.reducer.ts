import { createReducer, on } from '@ngrx/store';
import { initialState } from './order-upload.state';
import { OrderUploadEx } from './order-upload.model';
import { UploadStatus } from 'pfshared/pfapi';
import {
  addOrderUploadSuccess,
  cancelFileUpload,
  cancelOrderUploadSuccess,
  deleteOrderUploadSuccess,
  loadOrderUploads,
  loadOrderUploadsFailure,
  loadOrderUploadsSuccess,
  markOrderUploadCompleteSuccess,
  processOrderUploadSuccess,
  updateFileUploadProgress,
  updateOrderUploadSuccess,
} from './order-upload.actions';

export const orderUploadReducer = createReducer(
  // Supply the initial state
  initialState,

  // Add the new order upload to the order uploads array
  on(addOrderUploadSuccess, (state, { orderUpload }) => ({
    ...state,
    orderUploads: [
      ...state.orderUploads,
      { ...orderUpload } as OrderUploadEx
    ]
  })),

  // Remove a file upload from the order upload
  on(cancelFileUpload, (state, { fileUpload }) => {
    const index = state.orderUploads.findIndex(o => o.Id == fileUpload.idOrderUpload);
    if (index < 0) {
      return { ...state };
    }

    let orderUpload = { ...state.orderUploads[index] };
    let files = { ...orderUpload.files };

    // remove the file upload
    delete files[fileUpload.id];
    orderUpload.files = files;

    // update order upload
    let orderUploads = [...state.orderUploads];
    orderUploads[index] = orderUpload;

    return { ...state, orderUploads };
  }),

  // Cancel order upload processing
  on(cancelOrderUploadSuccess, (state, { orderUpload }) => {
    const index = state.orderUploads.findIndex(o => o.Id == orderUpload.Id);

    let orderUploads = [...state.orderUploads];
    orderUploads[index] = { ...orderUpload } as OrderUploadEx;

    return { ...state, orderUploads };
  }),

  // Remove the order upload from the order uploads array
  on(deleteOrderUploadSuccess, (state, { orderUpload }) => ({
    ...state,
    orderUploads: state.orderUploads.filter((o) => o.Id != orderUpload.Id)
  })),

  // Trigger loading the order uploads
  on(loadOrderUploads, (state) => ({
    ...state,
    error: null,
    status: 'loading'
  })),

  // Handle order uploads load failure
  on(loadOrderUploadsFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error'
  })),

  // Handle successfully loading order uploads
  on(loadOrderUploadsSuccess, (state, { orderUploads }) => ({
    ...state,
    orderUploads: orderUploads as OrderUploadEx[],
    error: null,
    status: 'success'
  })),

  // Mark an upload complete
  on(markOrderUploadCompleteSuccess, (state, { orderUpload }) => {
    const index = state.orderUploads.findIndex(o => o.Id == orderUpload.Id);
    if (index < 0) {
      return { ...state };
    }

    let orderUploads = [...state.orderUploads];
    orderUploads[index] = { ...orderUpload, status: UploadStatus.Complete } as OrderUploadEx;

    return { ...state, orderUploads };
  }),

  // Handle successfully starting the order upload process
  on(processOrderUploadSuccess, (state, { orderUpload }) => {
    const index = state.orderUploads.findIndex(o => o.Id == orderUpload.Id);
    if (index < 0) {
      return { ...state };
    }

    let orderUploads = [...state.orderUploads];
    orderUploads[index] = { ...orderUpload, status: UploadStatus.Uploading } as OrderUploadEx;

    return { ...state, orderUploads };
  }),

  // Update a file upload progress in the order upload
  on(updateFileUploadProgress, (state, { fileUpload }) => {
    const index = state.orderUploads.findIndex(o => o.Id == fileUpload.idOrderUpload);
    if (index < 0) {
      return { ...state };
    }

    let orderUpload = { ...state.orderUploads[index] };
    let files = { ...orderUpload.files };

    // update file map with new file upload
    files[fileUpload.id] = fileUpload;
    orderUpload.files = files;

    // update order upload
    let orderUploads = [...state.orderUploads];
    orderUploads[index] = orderUpload;

    return { ...state, orderUploads };
  }),

  // Update the order upload in the order uploads array
  on(updateOrderUploadSuccess, (state, { orderUpload }) => {
    const index = state.orderUploads.findIndex(o => o.Id == orderUpload.Id);
    if (index < 0) {
      return { ...state };
    }

    let orderUploads = [...state.orderUploads];
    orderUploads[index] = orderUpload as OrderUploadEx;

    return { ...state, orderUploads };
  }),
);