import { Collection, UploadStatus } from 'pfshared/pfapi';
import { CollectionModalComponent, CollectionModalComponentModule } from '../collection-modal/collection-modal.component';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FileUpload } from '@app/uploads/data-access/upload.model';
import { FileUploadMap, OrderUploadEx } from '@app/orders/data-access/order-upload.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { NGXLogger } from 'ngx-logger';
import { PhotoCountPipeModule } from '../photo-count.pipe';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-order-upload-files',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="uploads border border-2">
      <ngx-file-drop 
        dropZoneLabel="" 
        (onFileDrop)="dropped($event)" 
        (onFileOver)="fileOver($event)" 
        (onFileLeave)="fileLeave($event)"
        [directory]="true"
        [multiple]="true"
        dropZoneClassName="uploads-drop-zone"
        contentClassName="uploads-content">
          <ng-template ngx-file-drop-content-tmp let-openFileSelector="openFileSelector">
            <div class="upload-buttons-container">
              <button type="button" class="new-folder-button" (click)="newCollectionButtonClicked()" title="New Collection"><i class="fa-solid fa-plus fa-xl"></i></button>
              <button type="button" class="browse-button" (click)="browseButtonClicked(null, openFileSelector)" title="Browse for Folders and auto-generate Collection names"><i class="fa-solid fa-folder-plus fa-xl"></i></button>
            </div>
            <div class="uploads-container">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col" class="text-start text-nowrap">Collection</th>
                    <th scope="col" class="text-start text-nowrap">Twin Check</th>
                    <th scope="col" class="text-end text-nowrap">Photos <span class="badge text-bg-secondary bg-secondary" *ngIf="(orderUpload | photoCount) != 0">{{orderUpload | photoCount | number}}</span></th>
                    <th scope="col" class="collection-actions text-center text-nowrap">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let collection of orderUpload.Collections">
                    <td>{{collection.Name}}</td>
                    <td>{{collection.Description}}</td>
                    <td class="text-end">{{orderUpload | photoCount:collection | number}}</td>
                    <td class="collection-actions text-center">
                      <span (click)="editCollectionClicked(collection)"><i class="fa-solid fa-square-pen fa-xl px-1"></i></span>
                      <span (click)="browseButtonClicked(collection, openFileSelector)"><i class="fa-solid fa-folder-plus fa-xl px-1"></i></span>
                      <span (click)="deleteCollectionClicked(collection)"><i class="fa-solid fa-trash-can fa-xl px-1"></i></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ng-template>
      </ngx-file-drop>
    </div>
  `,
  styles: [`
    .order-upload-files {
      .uploads {
        height: 100%;
        max-height: 100%;
        position: relative;
      }

      .uploads-drop-zone {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .uploads-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;

        .uploads-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: auto;
        }

        .collection-actions {
          width: 110px;

          > span {
            cursor: pointer;
          }
        }
      }

      .upload-buttons-container {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 10;
        padding: 1em 1.5em;

        .new-folder-button {
          margin: .5em;
          background-color: #009d55;
          border-color: transparent;
          width: 3.5em;
          height: 3.5em;
          border-radius: 4em;
        }

        .browse-button {
          margin: .5em;
          background-color: #3498db;
          border-color: transparent;
          width: 3.5em;
          height: 3.5em;
          border-radius: 4em;
        }
      }
    }
  `]
})
export class OrderUploadFilesComponent implements OnInit {

  constructor(
    private logger: NGXLogger,
    private modalService: NgbModal
  ) { }

  @Input() orderUpload: OrderUploadEx;
  @Output() filesDropped: EventEmitter<Array<NgxFileDropEntry>> = new EventEmitter<Array<NgxFileDropEntry>>();

  private acceptableTypes = ["image/heic", "image/jpeg", "image/png"];
  private targetCollection: Partial<Collection>;

  ngOnInit(): void { }

  browseButtonClicked(collection: Partial<Collection>, openFileSelector: () => void) {
    this.targetCollection = collection;
    openFileSelector();
  }

  deleteCollectionClicked(collection: Partial<Collection>) {
    this.orderUpload.Collections = this.orderUpload.Collections.filter((c) => c.Id != collection.Id);

    // remove collection files
    let files: FileUploadMap = {};
    for (const [key, value] of Object.entries(this.orderUpload.files)) {
      if (value.idCollection != collection.Id) {
        files[key] = value;
      }
    }
    this.orderUpload.files = files;
  }

  editCollectionClicked(collection: Partial<Collection>) {
    const modalRef = this.modalService.open(CollectionModalComponent);
    modalRef.componentInstance.collection = { Name: collection.Name, TwinCheck: collection.Description };

    modalRef
      .result
      .then(result => {
        if (result) {
          // update the collection in the orderUpload
          // note: we need to replace the entire collection since this.orderUpload.Collections could be immutable
          const index = this.orderUpload.Collections.findIndex(c => c.Id == collection.Id);
          if (index >= 0) {
            let collections = [...this.orderUpload.Collections];
            collections[index] = { ...collection, Name: result.Name, Description: result.TwinCheck };

            this.orderUpload.Collections = collections;
          }
        }
      })
      .catch(e => { });
  }

  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          let name = file.name;
          let path: string = file.path;
          let relativePath = file.webkitRelativePath || fileEntry.fullPath;
          let size = file.size;
          let type = file.type;

          this.logger.trace(`dropped => ${relativePath}`, file);

          if (this.acceptableTypes.includes(type)) {
            let collection = this.targetCollection ?? this.getOrAddCollectionForFile(relativePath);

            // don't add duplicate files
            let collectionFiles = Object.values(this.orderUpload.files).filter(f => f.idCollection === collection.Id);
            let existing = collectionFiles.find(f => f.path === path);
            if (!existing) {
              // add this as an upload
              const id = uuid();
              const fileUpload = {
                id,
                idCollection: collection.Id,
                idOrder: this.orderUpload.idOrder,
                idOrderUpload: this.orderUpload.Id,
                name,
                path,
                relativePath,
                size,
                status: UploadStatus.Pending,
                mimetype: type
              } as FileUpload;

              this.logger.trace(`adding upload =>`, fileUpload);

              // update the list of files in the orderUpload
              this.orderUpload.files = {
                ...this.orderUpload.files,
                [id]: fileUpload
              };
            } else {
              this.logger.trace(`ignoring duplicate => ${path}`);
            }
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log("Directory===>");
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  fileOver(event) {
    this.targetCollection = null;
  }

  fileLeave(event) {
  }

  newCollectionButtonClicked(): void {
    const modalRef = this.modalService.open(CollectionModalComponent);
    modalRef.componentInstance.collection = { Name: '', TwinCheck: '' };

    modalRef
      .result
      .then(result => {
        if (result) {
          let collection = new Collection();

          // set the Id as the name, we'll update after the collection is saved
          collection.Id = result.Name;
          collection.Name = result.Name;
          collection.Description = result.TwinCheck;

          // update the list of collections in the orderUpload
          // note: we need to replace the entire collection since this.orderUpload.Collections could be immutable
          this.orderUpload.Collections = [...this.orderUpload.Collections, collection];
        }
      })
      .catch(e => { });
  }

  private getOrAddCollectionForFile(relativePath: string) {
    // find the matching collection or create a new one if a match isn't found
    let pathParts: string[]

    // full relative path without filename
    pathParts = relativePath.split("/").filter(p => !!p);
    pathParts.pop();

    const collectionName = pathParts.join("/");

    let collection = this.orderUpload.Collections.find(c => c.Name == collectionName);
    if (!collection) {
      collection = new Collection();

      // set the Id as the name, we'll update after the collection is saved
      collection.Id = collectionName;
      collection.Name = collectionName;

      // update the list of collections in the orderUpload
      // note: we need to replace the entire collection since this.orderUpload.Collections could be immutable
      this.orderUpload.Collections = [...this.orderUpload.Collections, collection];
    }

    return collection;
  }
}

@NgModule({
  imports: [
    CommonModule,
    CollectionModalComponentModule,
    NgxFileDropModule,
    PhotoCountPipeModule
  ],
  declarations: [OrderUploadFilesComponent],
  exports: [OrderUploadFilesComponent]
})
export class OrderUploadFilesComponentModule { }

