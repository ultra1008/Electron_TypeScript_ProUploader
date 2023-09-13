

import { PriceAdjustmentType } from "./PriceAdjustmentType";




export class OrderLineItemPriceBreakdownDetail {
    
    public AdjustmentType: PriceAdjustmentType = PriceAdjustmentType.None;
    public Id: number | null = null;
    public Name: string = "";
    public SavingsEach: number = 0;
}


