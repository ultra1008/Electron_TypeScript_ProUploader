





export class EventResult {
    
    public Alias: string = "";
    public Collections: EventCollection[] = [];
    public CoverPhoto: EventPhoto = null;
    public Date: Date = new Date(0);
    public Description: string = "";
    public Expiration: Date | null = null;
    public Id: number = 0;
    public Name: string = "";
    public Private: boolean = false;
    public Website: string = "";
}

export class EventCollection {
    
    public Description: string = "";
    public Name: string = "";
    public PreviewPhoto: EventPhoto = null;
}

export class EventPhoto {
    
    public Height: number = 0;
    public Url: string = "";
    public Width: number = 0;
}


