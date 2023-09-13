import { Injectable } from '@angular/core';
import { OrderUploadEx } from './order-upload.model';

@Injectable({ 
  providedIn: 'root' 
})
export class OrderUploadsStorageService {
  constructor() { }

  private storage: Storage = localStorage;

  getOrderUpload(idOrderUpload: string): Partial<OrderUploadEx> {
    let json = this.storage.getItem(`${idOrderUpload}`);
    if (!json) {
      return null;
    }
    return JSON.parse(json);
  }

  deleteOrderUpload(idOrderUpload: string): void {
    return this.storage.removeItem(`${idOrderUpload}`);
  }

  saveOrderUpload(orderUpload: Partial<OrderUploadEx>): void {
    return this.storage.setItem(`${orderUpload.Id}`, JSON.stringify({ 
      Id: orderUpload.Id,
      status: orderUpload.status,
      files: orderUpload.files
    }));
  }
}
