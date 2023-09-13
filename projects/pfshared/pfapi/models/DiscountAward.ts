


import { DiscountProduct } from "./DiscountProduct";
import { DiscountType } from "./DiscountType";



export class DiscountAward {
    
    public Amount: number | null = null;
    public FreeShipping: boolean = false;
    public Product: DiscountProduct = null;
    public Quantity: number | null = null;
    public TaxExempt: boolean = false;
    public Type: DiscountType = DiscountType.Percent;
    public TypeName: string = "";
}


