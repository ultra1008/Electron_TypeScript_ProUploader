

import { Order } from "./Order";

import { ProductSchemes } from "./ProductSchemes";



export class PriceOrderRequest {
    
    public Order: Order = null;
    public InhibitAvalara: boolean = false;
    public ProductScheme: ProductSchemes = ProductSchemes.ProductCategory;
}


