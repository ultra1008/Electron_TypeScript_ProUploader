





export class TrackingSummary {
    
    public Code: number = 0;
    public Result: string = "";
    public Message: string = "";
}

export class TrackingUpdate {
    
    public Date: string = "";
    public StatusDescription: string = "";
    public Details: string = "";
}

export class ShipperInfo {
    
    public WebLink: string = "";
    public CarrierCode: string = "";
    public History: TrackingUpdate[] = [];
}

export class TrackingMoreVerification {
    
    public Time: number = 0;
    public Signature: string = "";
}

export class TrackingData {
    
    public TrackingId: string = "";
    public TrackingNumber: string = "";
    public CarrierCode: string = "";
    public Status: string = "";
    public SecondaryStatus: string = "";
    public ScheduledDeliveryDate: string = "";
    public DateCreated: Date = new Date(0);
    public DateUpdated: Date = new Date(0);
    public OrderId: string = "";
    public ShippersData: ShipperInfo = null;
}

export class TrackingMoreShipment {
    
    public Summary: TrackingSummary = null;
    public Data: TrackingData = null;
}


