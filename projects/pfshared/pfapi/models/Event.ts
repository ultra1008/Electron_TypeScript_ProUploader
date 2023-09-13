


import { Photo } from "./Photo";



export class Event {
    
    public Alias: string = "";
    public CollectionCount: number = 0;
    public CoverPhoto: Photo = null;
    public Date: Date = new Date(0);
    public Description: string = "";
    public Id: number = 0;
    public Name: string = "";
    public Private: boolean = false;
    public Website: string = "";
    public SerializedPassword: string = "";
    public Password: string = "";
}


