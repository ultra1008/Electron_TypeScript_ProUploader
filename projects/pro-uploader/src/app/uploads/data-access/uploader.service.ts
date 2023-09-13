import AWS from 'aws-sdk';
import {
  $pf,
  Photo,
  S3Settings,
  UploadStatus
} from 'pfshared/pfapi';
import { AppSettings } from '@app/settings/data-access/settings.model';
import { AppState } from '@app/shared/state/app.state';
import {
  concatMap,
  delay,
  finalize,
  from,
  mergeMap,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { FileUpload } from './upload.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isGuid } from 'pfshared/utility';
import { NGXLogger } from 'ngx-logger';
import { selectCurrentSettings } from '@app/settings/data-access/settings.selectors';
import { Store } from '@ngrx/store';

interface FileContents {
  data: any;
  info: {
    width: number;
    height: number;
    type: string;
    mime: string;
    wUnits: string;
    hUnits: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  constructor(
    private $http: HttpClient,
    private logger: NGXLogger,
    private store: Store<AppState>
  ) {
    this.store.select(selectCurrentSettings).subscribe(settings => {
      this.settings = settings;
    })
  }

  private fakeUploadCounter = 0;
  private s3Settings$: Observable<S3Settings>;
  private settings: Partial<AppSettings> = {
    uploading: {
      accepts: "image/*",
      concurrentUploads: 3,
      mockUpload: false
    }
  };

  uploadFile(fileUpload: FileUpload): Observable<FileUpload> {
    return this.settings.uploading.mockUpload ? this.uploadFile_Mock(fileUpload) : this.uploadFile_S3(fileUpload);
  }

  private createPhotoForFileUpload(fileUpload: FileUpload, fileContents: FileContents, bucketName: string): Observable<Photo> {
    if (!fileUpload) {
      throw new Error("missing fileUpload argument");
    }

    // do a little filename cleanup:
    // 1) if the name is a GUID, just use the last chunk for the name
    // 2) change .jpeg to .jpg
    const parts = fileUpload.name.split(".");

    if (isGuid(parts[0])) {
      parts[0] = parts[0].split("-")[4];
    }

    parts[1] = parts[1].replace("jpeg", "jpg");

    const filename = `${parts[0]}.${parts[1]}`;

    // create the photo
    var request = {
      CollectionId: fileUpload.idCollection,
      Name: filename,
      Filename: filename,
      Filesize: fileUpload.size,
      Width: fileContents.info.width,
      Height: fileContents.info.height,
      StorageTag: fileUpload.id,
      UploadBucketName: bucketName
    };

    const url = `${$pf.apiUrl}/photos`;
    return this.$http.post<Photo>(url, request);
  }

  private getS3Settings(): Observable<S3Settings> {
    if (!this.s3Settings$) {
      const url = `${$pf.apiUrl}/dealers/${$pf.dealer.code}/s3;settings`;
      this.s3Settings$ = this.$http.get<S3Settings>(url).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.s3Settings$;
  }

  private uploadFile_Mock(fileUpload: FileUpload): Observable<FileUpload> {
    const fakeUploadCounter = ++this.fakeUploadCounter;
    this.logger.debug(`mock uploading ${fileUpload.path}`);
    return from(
      Array.from({ length: 100 }).fill(null).map((_, i) => i + 1)
    ).pipe(
      mergeMap(x =>
        of(x).pipe(
          delay(x * 100),
          switchMap(x =>
            fakeUploadCounter % 2 === 0 && x === 26
              ? throwError(() => new Error("Error happened!"))
              : of({ ...fileUpload, progress: x, status: x == 100 ? UploadStatus.Complete : UploadStatus.Uploading })
          ),
        )
      ),
      finalize(() => {
        this.logger.debug(`mock creating photo for ${fileUpload.path}`);
      })
    )
  }

  private uploadFile_S3(fileUpload: FileUpload): Observable<FileUpload> {
    return this.getS3Settings().pipe(
      concatMap((s3Settings) => {
        return new Observable<FileUpload>((observer) => {
          const s3 = new AWS.S3({
            accessKeyId: s3Settings.awsAccessKey,
            secretAccessKey: s3Settings.awsSecretAccessKey
          });

          (window as any).ipcRenderer.invoke('app:readFile', fileUpload.path)
            .then((fileContents: FileContents) => {
              this.logger.debug(`uploading ${fileUpload.path}`);

              const params = {
                Bucket: s3Settings.bucket,
                Key: fileUpload.id,
                Body: fileContents.data,
                ContentType: fileUpload.mimetype,
                ACL: 'public-read-write',
              }

              s3.upload(params, (err, data) => {
                if (err) {
                  throwError(() => new Error(err.message));
                  observer.complete();
                } else {
                  observer.next({ ...fileUpload, progress: 100, status: UploadStatus.Finalizing });

                  this.logger.debug(`creating photo for ${fileUpload.path}`);
                  this.createPhotoForFileUpload(fileUpload, fileContents, s3Settings.bucket).subscribe({
                    next: (photo) => console.log(photo),
                    error: (e) => observer.error(new Error("Failed to create a photo for this upload")),
                    complete: () => {
                      observer.next({ ...fileUpload, progress: 100, status: UploadStatus.Complete });
                      observer.complete();
                    }
                  });
                }
              }).on('httpUploadProgress', (progress) => {
                const percentage = (progress.loaded) * 100 / progress.total;
                observer.next({ ...fileUpload, progress: percentage, status: UploadStatus.Uploading });
              });
            })
            .catch(() => {
              throwError(() => new Error("Failed reading file contents"));
              observer.complete();
            });
        });
      })
    );
  }
}

