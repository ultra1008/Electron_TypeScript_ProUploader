


import { DiscountDeliveryCondition } from "./DiscountDeliveryCondition";
import { DiscountProduct } from "./DiscountProduct";



export class DiscountConditions {
    
    public Amount: number | null = null;
    public AvailableFor: DiscountDeliveryCondition = DiscountDeliveryCondition.AllOrders;
    public AvailableForName: string = "";
    public Buy: DiscountProduct = null;
    public Coupon: string = "";
    public LimitDays: string[] = [];
    public MembershipPlan: number | null = null;
    public MembershipPlanName: string = "";
    public MembersOnly: boolean = false;
    public Quantity: number | null = null;
}


