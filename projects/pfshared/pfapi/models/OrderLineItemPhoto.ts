


import { PaperFinish } from "./PaperFinish";



export class OrderLineItemPhoto {
    
    public idOrderLineItemPhoto: number = 0;
    public idPhoto: number = 0;
    public Border: number = 0;
    public BorderColor: string = "";
    public Finish: PaperFinish = PaperFinish.None;
    public FitToPaper: boolean = false;
    public CropX: number = 0;
    public CropY: number = 0;
    public CropWidth: number = 0;
    public CropHeight: number = 0;
    public CropOnDemand: boolean = false;
    public Dpi: number = 0;
    public UniqueId: string = "00000000-0000-0000-0000-000000000000";
    public Url: string = "";
    public ExternalId: string = "";
    public Name: string = "";
    public Width: number = 0;
    public Height: number = 0;
    public Size: number = 0;
    public DateCreated: Date = new Date(0);
}


