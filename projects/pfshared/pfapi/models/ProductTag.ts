





export class ProductTag {
    
    public Id: number = 0;
    public idDealer: number = 0;
    public idProduct: number = 0;
    public Source: ProductTagSource = ProductTagSource.Master;
    public TagName: string = "";
}


export const enum ProductTagSource {
    Master = 0,
    Supplier = 1,
    Dealer = 2
}

