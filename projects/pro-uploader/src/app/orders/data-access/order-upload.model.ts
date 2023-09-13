import { FileUpload } from "@app/uploads/data-access/upload.model";
import { OrderUpload, UploadStatus } from "pfshared/pfapi";

export type FileUploadMap = { [key: string]: FileUpload };

export class OrderUploadEx extends OrderUpload {

  constructor() {
    super();
  }

  files: FileUploadMap = {};
  status: UploadStatus = UploadStatus.Pending;
}
