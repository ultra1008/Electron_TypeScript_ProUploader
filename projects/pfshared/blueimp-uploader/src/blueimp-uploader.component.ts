import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

export interface UploadProgressAllData {
  bitrate: number;
  loaded: number;
  total: number;
}

export interface UploadSizeOption {
  Name: string;
  Description: string;
  Value: string;
  Size: number;
}

export interface UploadSummary {
  bitrate: number;
  endTime: number;
  progress: number;
  sizeRemaining: number;
  startTime: number;
  timeRemaining: number;
  totalFiles: number;
  totalSize: number;
  uploaded: number;
}

@Component({
  selector: 'pf-blueimp-uploader',
  templateUrl: './blueimp-uploader.component.html',
  styleUrls: ['./blueimp-uploader.component.scss']
})
export class BlueimpUploaderComponent implements OnInit, AfterViewInit {
  @Input() collectionId: string;
  @Input() hidePreview: boolean;
  @Input() options: any;

  @Output() photoUploaded = new EventEmitter<string>();
  @Output() uploadedComplete = new EventEmitter<void>();
  @Output() uploadedStart = new EventEmitter<void>();
  @Output() uploadedStop = new EventEmitter<void>();

  initialized: boolean;
  isDisabled: boolean;
  isUploading: boolean;
  selectedUploadSizeOption: UploadSizeOption;
  uploadQueue: File[] = [];
  uploadSizeOptions: UploadSizeOption[] = [];
  uploadSummary: UploadSummary = {
    bitrate: 0,
    endTime: new Date().getTime(),
    progress: 0,
    sizeRemaining: 0,
    startTime: new Date().getTime(),
    timeRemaining: 0,
    totalFiles: 0,
    totalSize: 0,
    uploaded: 0
  };

  get showChooseUploadSize(): boolean {
    if (this.isUploading) {
      return false;
    }
    return this.initialized && this.uploadSizeOptions.length > 1;
  }

  constructor(
    private logger: NGXLogger
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  cancelUploadClicked(): void {

  }

  removeFileClicked(file: File): void {

  }

  retryFileClicked(file: File): void {

  }

  startUploadClicked(): void {

  }
}
