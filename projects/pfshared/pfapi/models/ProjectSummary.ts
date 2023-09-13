


import { CreativeStyle } from "./CreativeStyle";



export class ProjectSummary {
    
    public DateCreated: Date = new Date(0);
    public DateModified: Date = new Date(0);
    public DealerId: number = 0;
    public Description: string = "";
    public HasFolioData: boolean = false;
    public Id: string = "00000000-0000-0000-0000-000000000000";
    public idDealer: number = 0;
    public Name: string = "";
    public ParentProjectId: string | null = "00000000-0000-0000-0000-000000000000";
    public PreviewUrl: string = "";
    public Price: number = 0;
    public ProductId: number = 0;
    public ProductCategoryId: number = 0;
    public ProductName: string = "";
    public StateId: string | null = "00000000-0000-0000-0000-000000000000";
    public Style: CreativeStyle = null;
    public ThumbnailUrl: string = "";
}


