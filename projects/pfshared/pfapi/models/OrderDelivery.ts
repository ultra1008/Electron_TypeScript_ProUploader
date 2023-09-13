


import { ShippingOption } from "./ShippingOption";
import { Store } from "./Store";



export class OrderDelivery {
    
    public AllowPickup: boolean = false;
    public AllowShipping: boolean = false;
    public ShippingOptions: ShippingOption[] = [];
    public PickupLocation: Store = null;
    public ShipOrder: boolean = false;
    public ShipToAddress: string = "";
    public ShipToCity: string = "";
    public ShipToCompany: string = "";
    public ShipToCountry: string = "";
    public ShipToCounty: string = "";
    public ShipToEmail: string = "";
    public ShipToFirstName: string = "";
    public ShipToLastName: string = "";
    public ShipToPhone: string = "";
    public ShipToState: string = "";
    public ShipToZip: string = "";
    public ShippingMethod: string = "";
    public Validate: boolean = false;
}


