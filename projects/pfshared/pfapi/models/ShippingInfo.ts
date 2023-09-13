

import { Address } from "./Address";

import { ShippingMethod } from "./ShippingMethod";



export class ShippingInfo {
    
    public Address: Address = null;
    public Email: string = "";
    public HideCountry: boolean = false;
    public ShippingMethod: ShippingMethod = null;
    public ShippingTotal: number = 0;
}


