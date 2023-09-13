

import { OrderLineItem } from "./OrderLineItem";
import { Product } from "./Product";
import { OrderSummary } from "./OrderSummary";



export class UpdateOrderOptionsResponse {
    
    public MediaLineItem: OrderLineItem = null;
    public MediaProduct: Product = null;
    public OrderLineItems: OrderLineItem[] = [];
    public OrderSummary: OrderSummary = null;
}


