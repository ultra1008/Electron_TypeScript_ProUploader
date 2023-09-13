

import { OrderSummary } from "./OrderSummary";
import { Product } from "./Product";
import { OrderLineItem } from "./OrderLineItem";



export class UpdateOrderLineItemsResponse {
    
    public OrderSummary: OrderSummary = null;
    public Products: Product[] = [];
    public Updates: OrderLineItem[] = [];
}


