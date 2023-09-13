

import { DiscountAward } from "./DiscountAward";
import { DiscountConditions } from "./DiscountConditions";




export class Discount {
    
    public Award: DiscountAward = null;
    public Conditions: DiscountConditions = null;
    public Description: string = "";
    public Enabled: boolean = false;
    public EndDate: Date = new Date(0);
    public Id: number = 0;
    public LimitPerCustomer: number = 0;
    public LimitPerOrder: number = 0;
    public Name: string = "";
    public StartDate: Date = new Date(0);
}


