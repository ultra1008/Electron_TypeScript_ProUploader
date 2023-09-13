import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { IsBusyService } from 'pfshared/is-busy';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { OrderUploadEx } from './order-upload.model';
import { OrderUploadsService } from '@app/orders/data-access/order-uploads.service';
import { OrderUploadsStorageService } from './order-uploads-storage.service';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/ui/toast/toast.service';
import { UploadService } from '@app/uploads/data-access/upload.service';
import { UploadStatus } from 'pfshared/pfapi';
import {
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  addOrderUpload,
  addOrderUploadFailure,
  addOrderUploadSuccess,
  cancelOrderUpload,
  cancelOrderUploadSuccess,
  deleteOrderUpload,
  deleteOrderUploadFailure,
  deleteOrderUploadSuccess,
  editOrderUploadComplete,
  loadOrderUploads,
  loadOrderUploadsFailure,
  loadOrderUploadsSuccess,
  markOrderUploadComplete,
  markOrderUploadCompleteFailure,
  markOrderUploadCompleteSuccess,
  processOrderUpload,
  processOrderUploadFailure,
  processOrderUploadSuccess,
  refreshOrderUploads,
  sendOrderUploadEmail,
  sendOrderUploadEmailFailure,
  sendOrderUploadEmailSuccess,
  updateFileUploadProgress,
  updateOrderUpload,
  updateOrderUploadFailure,
  updateOrderUploadSuccess,
} from './order-upload.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class OrderUploadEffects {

  constructor(
    private actions$: Actions,
    private busyService: IsBusyService,
    private logger: NGXLogger,
    private orderUploadsStorageService: OrderUploadsStorageService,
    private orderUploadsService: OrderUploadsService,
    private uploadService: UploadService,
    private router: Router,
    private toastService: ToastService
  ) { }

  addOrderUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addOrderUpload),
      switchMap((action) => {
        this.busyService.add({ key: ['default', 'add-order-upload'] });
        return this.orderUploadsService.createOrderUpload(action.orderUpload).pipe(
          map((orderUpload) => {
            let orderUploadEx = { ...action.orderUpload, ...orderUpload } as OrderUploadEx;
            this.normalizeFileUploadMap(orderUploadEx);
            this.orderUploadsStorageService.saveOrderUpload(orderUploadEx);

            return addOrderUploadSuccess({ orderUpload: orderUploadEx, upload: action.upload });
          }),
          catchError((error) => of(addOrderUploadFailure({ error }))),
          finalize(() => this.busyService.remove({ key: ['default', 'add-order-upload'] }))
        );
      })
    )
  );

  cancelOrderUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cancelOrderUpload),
      switchMap((action) => {
        // Cancel any current pending upload files
        this.uploadService.cancelOrderUpload(action.orderUpload);

        // Make order upload as pending
        let orderUploadEx = { ...action.orderUpload, status: UploadStatus.Pending } as OrderUploadEx;
        this.orderUploadsStorageService.saveOrderUpload(orderUploadEx);

        // Remove the DateUploadedUtc value from the order upload row
        return this.orderUploadsService.updateOrderUpload({ ...action.orderUpload, DateUploadedUtc: undefined }).pipe(
          map(updates => {
            return action.retry
              ? processOrderUpload({ orderUpload: { ...orderUploadEx, ...updates } })
              : cancelOrderUploadSuccess({ orderUpload: { ...orderUploadEx, ...updates } });
          })
        );
      })
    )
  );

  deleteOrderUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrderUpload),
      switchMap((action) => {
        this.busyService.add({ key: ['default', `delete-order-upload-${action.orderUpload.Id}`] });
        return this.orderUploadsService.deleteOrderUpload(action.orderUpload).pipe(
          map(() => {
            this.orderUploadsStorageService.deleteOrderUpload(action.orderUpload.Id);
            return deleteOrderUploadSuccess({ orderUpload: action.orderUpload });
          }),
          catchError((error) => of(deleteOrderUploadFailure({ error, orderUpload: action.orderUpload }))),
          finalize(() => this.busyService.remove({ key: ['default', `delete-order-upload-${action.orderUpload.Id}`] }))
        );
      })
    )
  );

  editOrderUploadComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editOrderUploadComplete),
      tap(() => this.router.navigate([`orders`]))
    ),
    { dispatch: false }
  );

  editOrderUploadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        addOrderUploadSuccess,
        updateOrderUploadSuccess
      ),
      map((action) => editOrderUploadComplete({ orderUpload: action.orderUpload }))
    )
  );

  loadOrderUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderUploads),
      switchMap(() => {
        return this.orderUploadsService.orderUploads$.pipe(
          // Take order uploads and return a new success action containing the orders
          map((orderUploads) => {
            orderUploads = orderUploads.map((orderUpload: OrderUploadEx) => {
              let o = {
                ...orderUpload,
                files: {},
                ...this.orderUploadsStorageService.getOrderUpload(orderUpload.Id)
              };

              if (typeof o.status == "undefined" || o.status == UploadStatus.None) {
                if (o.DateUploadedUtc) {
                  o.status = UploadStatus.Complete;
                } else {
                  o.status = UploadStatus.Pending;
                }
              }

              return o;
            });

            return loadOrderUploadsSuccess({ orderUploads });
          }),
          // Or... if it errors return a new failure action containing the error
          catchError((error) => of(loadOrderUploadsFailure({ error })))
        );
      }
      )
    )
  );

  markOrderUploadComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markOrderUploadComplete),
      switchMap((action) =>
        this.orderUploadsService.markOrderUploadComplete(action.orderUpload).pipe(
          map((orderUpload) => {
            this.orderUploadsStorageService.deleteOrderUpload(orderUpload.Id);

            return markOrderUploadCompleteSuccess({ orderUpload: { ...action.orderUpload, ...orderUpload } });
          }),
          catchError((error) => of(markOrderUploadCompleteFailure({ error })))
        )
      )
    )
  );

  sendOrderUploadEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendOrderUploadEmail),
      switchMap((action) =>
        this.orderUploadsService.sendOrderUploadEmail(action.orderUpload).pipe(
          map(() => {
            return sendOrderUploadEmailSuccess({ orderUpload: action.orderUpload });
          }),
          catchError((error) => of(sendOrderUploadEmailFailure({ error })))
        )
      )
    )
  );

  sendOrderUploadEmailSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendOrderUploadEmailSuccess),
      tap((action) => {
        return this.toastService.showSuccess("Email sent");
      })
    ),
    { dispatch: false }
  );

  processOrderUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processOrderUpload),
      switchMap((action) =>
        // Submit the order for processing while the files are being uploaded
        this.orderUploadsService.processOrderUpload(action.orderUpload).pipe(
          map((orderUpload) => {
            let orderUploadEx = { ...action.orderUpload, ...orderUpload } as OrderUploadEx;
            this.uploadService.processOrderUpload(orderUploadEx);
            return processOrderUploadSuccess({ orderUpload: orderUploadEx });
          }),
          catchError((error) => of(processOrderUploadFailure({ error })))
        )
      )
    )
  );

  processOrderUploadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(processOrderUploadSuccess),
      tap((action) => {
        // Save status changes to storage
        this.orderUploadsStorageService.saveOrderUpload(action.orderUpload);
      })
    ),
    { dispatch: false }
  );

  refreshOrderUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshOrderUploads),
      tap((action) => {
        this.orderUploadsService.refreshData();
      })
    ),
    { dispatch: false }
  );

  showFailureError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(...[
        addOrderUploadFailure,
        deleteOrderUploadFailure,
        loadOrderUploadsFailure,
        markOrderUploadCompleteFailure,
        processOrderUploadFailure,
        sendOrderUploadEmailFailure,
        updateOrderUploadFailure
      ]),
      tap((action) => this.logger.error(action.error)),
      tap((action) => {
        let msg: string;
        if (action.error instanceof HttpErrorResponse) {
          msg = action.error.error;
        }
        if (action.error.message) {
          msg = action.error.message;
        }
        if (action.error.error?.Message) {
          msg = action.error.error.Message;
        }
        return this.toastService.showError(msg ?? action.error);
      })
    ),
    { dispatch: false }
  );

  startOrderUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        addOrderUploadSuccess,
        updateOrderUploadSuccess
      ),
      filter((action) => action.upload),
      map((action) => processOrderUpload({ orderUpload: action.orderUpload }))
    )
  );

  updateFileUploadProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFileUploadProgress),
      tap((action) => {
        var orderUpload = this.orderUploadsStorageService.getOrderUpload(action.fileUpload.idOrderUpload)
        if (orderUpload) {
          orderUpload.files[action.fileUpload.id] = action.fileUpload;
          this.orderUploadsStorageService.saveOrderUpload(orderUpload);
        }
      })
    ),
    { dispatch: false }
  );

  updateOrderUploads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateOrderUpload),
      switchMap((action) => {
        this.busyService.add({ key: ['default', `update-order-upload-${action.orderUpload.Id}`] });
        return this.orderUploadsService.updateOrderUpload(action.orderUpload).pipe(
          map((orderUpload) => {
            let orderUploadEx = { ...action.orderUpload, ...orderUpload } as OrderUploadEx;
            this.normalizeFileUploadMap(orderUploadEx);
            this.orderUploadsStorageService.saveOrderUpload(orderUploadEx);

            return updateOrderUploadSuccess({ orderUpload: orderUploadEx, upload: action.upload });
          }),
          catchError((error) => of(updateOrderUploadFailure({ error, orderUpload: action.orderUpload }))),
          finalize(() => this.busyService.remove({ key: ['default', `update-order-upload-${action.orderUpload.Id}`] }))
        );
      })
    )
  );

  private normalizeFileUploadMap(orderUpload: OrderUploadEx) {
    let files = { ...orderUpload.files };

    // we need to update the file's collection and order ids with the return values
    orderUpload.Collections.forEach(collection => {
      for (const [key, value] of Object.entries(files)) {
        let file = {
          ...value,
          idOrder: orderUpload.idOrder,
          idOrderUpload: orderUpload.Id
        }

        if (value.idCollection == collection.Name) {
          file.idCollection = collection.Id;
        }

        files[key] = {
          ...value,
          ...file
        }
      }
    });

    // remove any orphaned files
    for (const [key, value] of Object.entries(files)) {
      let collection = orderUpload.Collections.find(c => c.Id == value.idCollection);
      if (!collection) {
        delete files[key];
      }
    }

    orderUpload.files = files;
  }
}
