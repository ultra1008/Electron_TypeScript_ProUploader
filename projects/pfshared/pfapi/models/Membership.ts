


import { Discount } from "./Discount";
import { Product } from "./Product";



export class Membership {
    
    public AlbumLimit: number = 0;
    public AllowPurchase: boolean = false;
    public AllowVideo: boolean = false;
    public AllowWatermark: boolean = false;
    public Description: string = "";
    public Discount: Discount = null;
    public Enabled: boolean = false;
    public HiResDownload: boolean = false;
    public Id: number = 0;
    public IsCategoryProduct: boolean = false;
    public MonthDuration: number = 0;
    public Name: string = "";
    public NeverEnds: boolean = false;
    public PhotoLimit: number = 0;
    public PhotoSizeLimit: number = 0;
    public Price: number = 0;
    public ProductAward: Product = null;
    public PurchasePlan: Product = null;
}


