

import { OrderLineItem } from "./OrderLineItem";
import { ProductSchemes } from "./ProductSchemes";



export class UpdateOrderLineItemsRequest {
    
    public Added: OrderLineItem[] = [];
    public Removed: OrderLineItem[] = [];
    public Updated: OrderLineItem[] = [];
    public ProductScheme: ProductSchemes = ProductSchemes.ProductCategory;
}


