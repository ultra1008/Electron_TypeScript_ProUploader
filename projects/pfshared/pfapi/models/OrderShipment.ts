

import { DeliveryTracking } from "./DeliveryTracking";

import { ShipmentItem } from "./ShipmentItem";



export class OrderShipment {
    
    public Deliveries: DeliveryTracking[] = [];
    public FulfillerDealerCode: string = "";
    public FulfillerName: string = "";
    public Items: ShipmentItem[] = [];
}


