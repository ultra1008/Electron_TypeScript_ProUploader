import { OrderUploadEx } from "./order-upload.model";

export interface OrderUploadState {
  orderUploads: OrderUploadEx[];
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: OrderUploadState = {
  orderUploads: [],
  error: null,
  status: 'pending'
};

