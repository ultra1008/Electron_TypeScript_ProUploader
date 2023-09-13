import { UploadStatus } from "pfshared/pfapi";

export interface FileUpload {
  id: string;
  idCollection: string;
  idOrder: number;
  idOrderUpload: string;
  mimetype: string;
  name: string;
  path: string;
  relativePath: string;
  size: number;
  status: UploadStatus;

  error?: string;
  idUpload?: string;
  progress?: number;
  toRemove?: boolean;
  uploaded?: Date;
}

export interface ActivitySummary {
  busy?: boolean;
  fileCount?: number;
  uploadCount?: number;
  failedCount?: number;
  progress?: number;
};

export type ActivitySummaryMap = { [key: string ]: ActivitySummary }

