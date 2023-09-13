import { ActivitySummaryMap, FileUpload } from './upload.model';
import { AppSettings } from '@app/settings/data-access/settings.model';
import { AppState } from '@app/shared/state/app.state';
import { Injectable } from '@angular/core';
import { markOrderUploadComplete, updateFileUploadProgress } from '@app/orders/data-access/order-upload.actions';
import { NGXLogger } from 'ngx-logger';
import { OrderUpload, UploadStatus } from 'pfshared/pfapi';
import { OrderUploadEx } from '@app/orders/data-access/order-upload.model';
import { selectActiveOrderUploads, selectRecentOrderUploads } from '@app/orders/data-access/order-upload.selectors';
import { Store } from '@ngrx/store';
import { UploaderService } from './uploader.service';
import { v4 as uuid } from 'uuid';
import {
  catchError,
  combineLatest,
  concatMap,
  filter,
  map,
  merge,
  mergeAll,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  scan,
  share,
  shareReplay,
  startWith,
  Subject,
  take,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private logger: NGXLogger,
    private store: Store<AppState>,
    private uploader: UploaderService
  ) {
  }

  private settings: Partial<AppSettings> = { 
    uploading: {
      accepts: "image/*",
      concurrentUploads: 3,
      mockUpload: false
    }
  };
  private file$$: Subject<FileUpload> = new Subject();
  private retryFile$$: ReplaySubject<FileUpload> = new ReplaySubject();
  private stopFile$$: ReplaySubject<FileUpload> = new ReplaySubject();

  private fileStartOrRetry$: Observable<FileUpload> = this.file$$.pipe(
    mergeMap(file =>
      this.retryFile$$.pipe(
        filter(retryFile => retryFile.idUpload === file.idUpload),
        startWith(file)
      )
    ),
    share()
  );

  private addFileToQueueAfterStartOrRetry$: Observable<FileUpload> = this.fileStartOrRetry$.pipe(
    map(file => ({
      ...file,
      progress: 0,
      error: "",
      status: UploadStatus.Pending,
      toRemove: false
    }))
  );

  private markFileToBeRemovedAfterStop$: Observable<FileUpload> = this.stopFile$$.pipe(
    map(file => ({
      ...file,
      progress: 0,
      error: "",
      status: UploadStatus.Pending,
      toRemove: true
    }))
  );

  private fileProgress$: Observable<FileUpload> = this.fileStartOrRetry$.pipe(
    map(fileUpload => {
      this.store.dispatch(updateFileUploadProgress({ fileUpload }));

      return this.uploader.uploadFile(fileUpload).pipe(
        takeUntil(
          this.stopFile$$.pipe(
            filter(stopFile => stopFile.idUpload === fileUpload.idUpload)
          )
        ),
        catchError((e) => of({ ...fileUpload, error: e.message, status: UploadStatus.Failed })),
        scan(
          (acc, curr) => ({ ...acc, ...curr }), {
            ...fileUpload,
            progress: 0,
            error: "",
            toRemove: false
          } as FileUpload
        )
      );
    }),
    // upload in parallel maximum
    mergeAll(this.settings.uploading.concurrentUploads),
    // share subscriptions
    share()
  );

  files$: Observable<FileUpload[]> = merge(
    this.addFileToQueueAfterStartOrRetry$,
    this.fileProgress$,
    this.markFileToBeRemovedAfterStop$
  ).pipe(
    scan<FileUpload, { [key: string]: FileUpload }>((acc, curr) => {
      if (curr.toRemove) {
        this.logger.debug(`${curr.name} marked as toRemove. deleting ${curr.name} from files$ queue ...`);
        const copy = { ...acc };
        delete copy[curr.idUpload];
        return copy;
      }

      return {
        ...acc,
        [curr.idUpload]: curr
      };
    }, {}),
    map(fileEntities => Object.values(fileEntities)),
    shareReplay(1)
  );

  private completedFileUploads$ = this.fileProgress$.pipe(
    filter(fileUpload => fileUpload.status == UploadStatus.Complete || fileUpload.status == UploadStatus.Failed),
    tap((fileUpload) => this.logger.trace('emitting completed fileUpload => ', fileUpload))
  );

  private completedOrderUploads$ = this.completedFileUploads$.pipe(
    filter(fileUpload => !fileUpload.error),
    tap(fileUpload => this.logger.trace(`received completed fileUpload => `, fileUpload)),
    concatMap(fileUpload => this.store.select(selectActiveOrderUploads).pipe(
      take(1),
      map(orderUploads => {
        let orderUpload = orderUploads.find(o => o.Id == fileUpload.idOrderUpload);
        if (orderUpload) {
          this.logger.trace(`found orderUpload. see if it's done.`);
          let files = Object.values(orderUpload.files);
          let fileCount = files.length;
          let uploadCount = files.filter(f => f.status == UploadStatus.Complete).length;
          let failedCount = files.filter(f => f.status == UploadStatus.Failed).length;

          this.logger.trace(`fileCount=${fileCount}, uploadCount=${uploadCount}, failedCount=${failedCount}`);

          if (fileCount == (uploadCount - failedCount)) {
            this.logger.debug(`Emitting order complete - ${orderUpload.idOrder}`);
            return orderUpload;
          } else {
            this.logger.trace(`orderUpload NOT complete.`);
          }
        } else {
          this.logger.trace(`didn't find active orderUpload. returning null.`);
        }

        return null;
      })
    )),
    filter(orderUpload => !!orderUpload)
  );

  readonly uploadActivity$: Observable<OrderUploadEx[]> = combineLatest([
    this.store.select(selectActiveOrderUploads),
    this.store.select(selectRecentOrderUploads)
  ]).pipe(
    map(([active, recent]) => [...(active || []), ...(recent || [])])
  );

  readonly uploadActivitySummary$: Observable<ActivitySummaryMap> = this.uploadActivity$.pipe(
    map(orderUploads => {
      return orderUploads.reduce((acc, curr) => {
        if (curr.status == UploadStatus.Complete) {
          let photoCount = curr.Collections.reduce((p, c) => p + c.PhotoCount, 0);

          return {
            ...acc,
            [curr.Id]: {
              fileCount: photoCount,
              uploadCount: photoCount,
              failedCount: 0,
              progress: 100,
              busy: false
            }
          }
        }

        let files = Object.values(curr.files);
        let fileCount = files.length;
        let uploadCount = files.filter(f => f.progress == 100 || f.error).length;
        let failedCount = files.filter(f => f.error).length;
        let progress = (uploadCount / fileCount) * 100;
        let busy = progress < 100;

        return {
          ...acc,
          [curr.Id]: {
            fileCount: fileCount,
            uploadCount,
            failedCount,
            progress,
            busy
          }
        }
      }, {} as ActivitySummaryMap);
    }),
    //tap(console.log)
  );

  addFile(file: FileUpload) {
    if (!file.idUpload) {
      file = {
        ...file,
        idUpload: uuid()
      };
    }

    this.file$$.next(file);
  }

  private testFilesCount = 0;

  addTestFile() {
    this.addFile({
      id: uuid(),
      idCollection: "12345678",
      idOrder: 12345678,
      idOrderUpload: "12345678",
      name: `test-file-${this.testFilesCount}`,
      path: `test-file-${this.testFilesCount}`,
      relativePath: `test-file-${this.testFilesCount}`,
      size: 99999,
      status: UploadStatus.Pending,
      mimetype: "image/jpg",

      idUpload: uuid(),
    });

    this.testFilesCount++;
  }

  cancelOrderUpload(orderUpload: OrderUpload) {
    this.logger.debug(`canceling OrderUpload ${orderUpload.idOrder} ...`);
    this.files$.pipe(
      map(files => files.filter(f => f.idOrderUpload == orderUpload.Id)),
      takeWhile(files => files.length > 0),
      tap(files => {
        files.forEach(file => {
          this.removeFile(file);
        });
      })
    ).subscribe();
  }

  processOrderUpload(orderUpload: OrderUpload) {
    this.logger.debug(`processing OrderUpload ${orderUpload.idOrder} ...`);
    let orderUploadEx = orderUpload as OrderUploadEx;
    for (const [key, value] of Object.entries(orderUploadEx.files)) {
      switch (value.status) {
        case UploadStatus.Uploaded:
        case UploadStatus.Finalizing:
        case UploadStatus.Complete:
          // already uploaded, don't re-upload
          this.logger.trace(`skipping ${value.name}. already uploaded ...`);
          break;

        default:
          let fileUpload = {
            ...value,
            idUpload: uuid(),
            progress: 0,
            error: "",
            toRemove: false
          };

          this.logger.trace(`uploading ${value.name} ...`, fileUpload);
          this.addFile(fileUpload);
          break;
      }
    }
  }

  retryFile(file: FileUpload) {
    this.removeFile(file);
    this.logger.trace(`retrying ${file.name} ...`);
    this.addFile({
      ...file,
      idUpload: uuid(),
      progress: 0,
      error: "",
      toRemove: false
    });
  }

  removeFile(file: FileUpload) {
    this.logger.trace(`removing ${file.name} ...`);
    this.stopFile$$.next(file);
  }

  start(settings: AppSettings) {
    this.logger.trace(`starting watch for uploads ...`);

    // save settings
    this.settings = settings;

    // always be uploading...
    this.files$.subscribe();

    // handle completed file uploads
    this.completedFileUploads$
      .subscribe(fileUpload => {
        this.logger.trace(`FileUpload, ${fileUpload.name}, completed...${fileUpload.error ? "with errors" : ""}`);
        if (fileUpload.status == UploadStatus.Complete) {
          fileUpload.uploaded = new Date();
        }
        this.store.dispatch(updateFileUploadProgress({ fileUpload }));
      });

    // handle completed order uploads
    this.completedOrderUploads$
      .subscribe(orderUpload => {
        this.logger.trace(`OrderUpload, ${orderUpload.idOrder}, completed...`);
        this.store.dispatch(markOrderUploadComplete({ orderUpload }))
      });
  }
}

