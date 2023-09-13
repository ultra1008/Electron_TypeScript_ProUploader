


import { ProductOptionDisplayOnTypes } from "./ProductOptionDisplayOnTypes";
import { ProductOption } from "./ProductOption";
import { ProductOptionItemType } from "./ProductOptionItemType";



export class ProductOptionItem {
    
    public Description: string = "";
    public DisplayOn: ProductOptionDisplayOnTypes = ProductOptionDisplayOnTypes.Workflow;
    public Enabled: boolean = false;
    public Options: ProductOption[] = [];
    public Prompt: string = "";
    public Type: ProductOptionItemType = ProductOptionItemType.TextInput;
}


