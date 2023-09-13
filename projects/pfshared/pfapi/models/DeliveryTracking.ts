


import { DeliveryUpdate } from "./DeliveryUpdate";
import { DeliveryStatus } from "./DeliveryStatus";



export class DeliveryTracking {
    
    public Carrier: string = "";
    public DeliveryDate: Date | null = null;
    public ExpectedDate: Date | null = null;
    public History: DeliveryUpdate[] = [];
    public LastUpdate: Date | null = null;
    public ShipDate: Date | null = null;
    public Status: DeliveryStatus = DeliveryStatus.None;
    public StatusText: string = "";
    public TrackingId: string = "";
    public TrackingNumber: string = "";
}


