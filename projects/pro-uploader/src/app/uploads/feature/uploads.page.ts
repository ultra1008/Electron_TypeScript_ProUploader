import { Component, OnInit } from '@angular/core';
import { cancelFileUpload } from '@app/orders/data-access/order-upload.actions';
import { AppState } from '@app/shared/state/app.state';
import { Store } from '@ngrx/store';
import { UploadStatus } from 'pfshared/pfapi';
import { BehaviorSubject, combineLatest, filter, map, startWith } from 'rxjs';
import { FileUpload } from '../data-access/upload.model';
import { UploadService } from '../data-access/upload.service';

@Component({
  selector: 'app-uploads',
  template: `
    <ng-container *ngIf="files$ | async as files">
      <header>
        <div class="caption d-flex align-items-start">
          <h3>Uploads</h3>
          <span class="badge text-bg-secondary bg-secondary mx-2" *ngIf="files.length > 0">{{files.length | number}}</span>
          <button (click)="addTestFileToUploadQueue()" *ngIf="false">Add file</button>
        </div>
        <div class="search">
          <app-search [search]="search$$ | async" (searchChanged)="onSearchChanged($event)" placeholder="{{'UPLOADS.SEARCH' | translate}}"></app-search>
        </div>
      </header>

      <div class="content">
        <div class="scrollable-table-container">
          <div class="scrollable-table-wrapper">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col" class="order-number">Order #</th>
                  <th scope="col">Name</th>
                  <th scope="col">Size</th>
                  <th scope="col" class="upload-progress text-center">Progress</th>
                  <th scope="col" class="upload-actions text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let file of files">
                  <th scope="row">{{ file.idOrder }}</th>
                  <td>{{ file.relativePath }}</td>
                  <td>{{ file.size | filesize }}</td>
                  <ng-container *ngIf="file.error">
                    <td class="upload-progress text-center text-danger align-middle">
                      <span ngbPopover="{{file.error}}" [openDelay]="300" [closeDelay]="500" triggers="mouseenter:mouseleave">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i>failed
                      </span>
                    </td>
                  </ng-container>
                  <ng-container *ngIf="!file.error">
                    <td class="upload-progress text-center align-middle" *ngIf="file.status == UploadStatus.Pending">
                        pending
                    </td>
                    <td class="upload-progress text-start align-middle" *ngIf="file.status == UploadStatus.Uploading">
                      <ngb-progressbar type="success" textType="white" [value]="file.progress" [showValue]="true"></ngb-progressbar>
                    </td>
                    <td class="upload-progress text-center align-middle" *ngIf="file.status == UploadStatus.Finalizing">
                        finalizing
                    </td>
                    <td class="upload-progress text-center align-middle" *ngIf="file.status == UploadStatus.Complete">
                        complete
                    </td>
                  </ng-container>
                  <td class="upload-actions text-center">
                    <span (click)="retryUploadClicked(file)" *ngIf="file.status == UploadStatus.Failed">
                      <i class="fa-solid fa-repeat fa-xl px-2"></i>
                    </span>
                    <span (click)="cancelUploadClicked(file)" *ngIf="file.status == UploadStatus.Failed || file.progress < 100">
                      <i class="fa-solid fa-trash-can fa-xl px-2"></i>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer></footer>
    </ng-container>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
      height: 100%;

      header {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: gray;

        .caption {
          h3 {
            margin-bottom: 0;
          }
        }

        .search {
          width: 24rem;
        }
      }

      .content {
        .order-number {
          width: 200px;
        }

        .upload-progress {
          width: 200px;

          &.text-danger {
            cursor: pointer;
          }
        }

        .upload-actions {
          width: 200px;

          > span {
            cursor: pointer;
          }
        }
      }

      footer {
      }
    }
  `]
})
export class UploadsPage implements OnInit {
  constructor(
    private store: Store<AppState>,
    private uploadService: UploadService
  ) { }

  readonly UploadStatus = UploadStatus;

  search$$ = new BehaviorSubject<string>("");

  files$ = combineLatest([
    this.uploadService.files$,
    this.search$$,
  ]).pipe(
    map(([files, search]) => {
      search = search.toLowerCase();
      return files.filter(f => {
        if (!search) {
          if (f.status == UploadStatus.Complete) {
            return false;
          }
        }

        if (search) {
          return (f.idOrder.toString().includes(search) || f.name?.toLowerCase().includes(search));
        }

        return true;
      });
    }),
    startWith([])
  );

  ngOnInit(): void { }

  public addTestFileToUploadQueue() {
    this.uploadService.addTestFile();
  }

  cancelUploadClicked(fileUpload: FileUpload) {
    this.uploadService.removeFile(fileUpload);
    this.store.dispatch(cancelFileUpload({ fileUpload }));
  }

  onSearchChanged(event) {
    this.search$$.next(event.search);
  }

  retryUploadClicked(fileUpload: FileUpload) {
    this.uploadService.retryFile(fileUpload);
  }
}
