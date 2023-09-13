





export class ProductResult {

    public CategoryPath: ProductResultCategoryPath[] = [];
    public Description: string = "";
    public Enabled: boolean = false;
    public Fulfillment: string = "";
    public Height: number = 0;
    public Id: number = 0;
    public ImageUrl: string = "";
    public Name: string = "";
    public Price: number = 0;
    public PriceTiers: ProductResultPriceTier[] = [];
    public ProductID: number = 0;
    public ProductType: string = "";
    public Tags: string = "";
    public Url: string = "";
    public Width: number = 0;
}

export class ProductResultPriceTier {

    public MinimumQuantity: number = 0;
    public Price: number = 0;
}

export class ProductResultCategoryPath {

    public Name: string = "";
    public Url: string = "";
}


