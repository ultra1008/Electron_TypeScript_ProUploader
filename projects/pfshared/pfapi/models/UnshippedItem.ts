


import { OrderStatus } from "./OrderStatus";
import { ShipmentItem } from "./ShipmentItem";






export class UnshippedItem extends ShipmentItem {
    
    public FulfillerDealerCode: string = "";
    public FulfillerName: string = "";
    public Status: OrderStatus = OrderStatus.New;
    public StatusText: string = "";
}


