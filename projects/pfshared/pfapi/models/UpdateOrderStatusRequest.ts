


import { ProductSchemes } from "./ProductSchemes";
import { TrackingInfo } from "./TrackingInfo";



export class UpdateOrderStatusRequest {
    
    public DealerCode: string = "";
    public OrderLineItemList: number[] = [];
    public ProductList: number[] = [];
    public StationLocation: number = 0;
    public Status: string = "";
    public ProductScheme: ProductSchemes = ProductSchemes.ProductCategory;
    public TrackingInfo: TrackingInfo = null;
    public Message: string = "";
}


