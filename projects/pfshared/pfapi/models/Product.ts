


import { ProductCategory } from "./ProductCategory";
import { MultipleCopyPricing } from "./MultipleCopyPricing";
import { ProductOptions } from "./ProductOptions";
import { PriceTier } from "./PriceTier";
import { ProductProperties } from "./ProductProperties";



export class Product {

    public AdditionalUnitPrice: number | null = null;
    public ApmProductId: number = 0;
    public Borders: boolean = false;
    public Breadcrumb: string = "";
    public Category: ProductCategory = null;
    public CategoryPath: string = "";
    public ChildProducts: Product[] = [];
    public Description: string = "";
    public DirectUrl: string = "";
    public Enabled: boolean = false;
    public Finishes: number = 0;
    public Fulfillment: string = "";
    public Height: number = 0;
    public Id: number = 0;
    public idProduct: number = 0;
    public idProductCategory: number = 0;
    public idFulfillmentProduct: number = 0;
    public IsFulfillmentDisabled: boolean = false;
    public IsCategoryProduct: boolean = false;
    public IsSupplier: boolean = false;
    public MultipleCopyPricing: MultipleCopyPricing = null;
    public Name: string = "";
    public Options: ProductOptions = null;
    public PreviewUrl: string = "";
    public Price: number = 0;
    public PriceTiers: PriceTier[] = [];
    public ProductID: number = 0;
    public ProductType: string = "";
    public Properties: ProductProperties = null;
    public Quantity?: number | null = null;
    public SalePrice: number | null = null;
    public SortOrder: number = 0;
    public StyleCount: number = 0;
    public Tags: string[] = [];
    public Upc: string = "";
    public Width: number = 0;
    public WholesalePrice: number | null = null;
    public WholesaleAdditionalUnitPrice: number | null = null;
}


