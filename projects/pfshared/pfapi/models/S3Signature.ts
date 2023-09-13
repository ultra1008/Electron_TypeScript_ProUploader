export interface IUploadConfiguration {
  FormAttributes: { [key: string]: string; };
  FormFields: { [key: string]: string; };
}

export class S3Signature {
    
    public bucket: string = "";
    public configuration: IUploadConfiguration = null;
    public maxFileSize: number = 0;
}


