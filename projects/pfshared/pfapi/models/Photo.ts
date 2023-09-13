





export class Photo {
    
    public CollectionId: string = "";
    public DateAdded: Date = new Date(0);
    public DateModified: Date | null = null;
    public DateTaken: Date | null = null;
    public Description: string = "";
    public ExternalId: string = "";
    public Filename: string = "";
    public Filesize: number = 0;
    public Format: number = 0;
    public Height: number = 0;
    public Id: number = 0;
    public IsExternal: boolean = false;
    public IsStored: boolean | null = null;
    public LocalFilename: string = "";
    public MediaType: number | null = null;
    public Name: string = "";
    public PhotoSize: number | null = null;
    public PreserveFormat: boolean | null = null;
    public PreviewUrl: string = "";
    public ScreenUrl: string = "";
    public StorageTag: string = "";
    public ThumbnailUrl: string = "";
    public UploadBucketName: string = "";
    public Url: string = "";
    public Width: number = 0;
}


