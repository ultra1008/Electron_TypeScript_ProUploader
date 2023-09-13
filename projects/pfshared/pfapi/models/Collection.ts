


import { Photo } from "./Photo";
import { Watermark } from "./Watermark";



export class Collection {
    
    public ArchiveUrl: string = "";
    public ClaimCode: string = "";
    public DateCreated: Date = new Date(0);
    public DateModified: Date = new Date(0);
    public Description: string = "";
    public Expiration: Date = new Date(0);
    public Id: string = "";
    public IsOrderedFrom: boolean = false;
    public IsPublic: boolean = false;
    public Name: string = "";
    public PhotoCount: number = 0;
    public PreviewPhoto: Photo = null;
    public UserId: number = 0;
    public Watermark: Watermark = null;
    public SerializedPassword: string = "";
    public Password: string = "";
}


