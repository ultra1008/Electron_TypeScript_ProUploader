


import { Product } from "./Product";
import { ProductTag } from "./ProductTag";
import { ProductServiceFeeChargeTypes } from "./ProductServiceFeeChargeTypes";






export class ProductServiceFee {

    public BaseQualifier: number | null = null;
    public ChargeType: ProductServiceFeeChargeTypes = ProductServiceFeeChargeTypes.ChargeFeeOnceForAggregateQuantityOfAllGroupItems;
    public Description: string = "";
    public Enabled: boolean = false;
    public Id: number = 0;
    public idDealer: number = 0;
    public Name: string = "";
    public PriceTiers: ProductServiceFeePriceTier[] = [];
    public Products: Product[] = [];
    public ProductTags: ProductTag[] = [];
    public WaiveFeeIfAnotherHigherFeeProductIsOnOrder: boolean = false;
    public WaiveFeeIfProductIsFree: boolean = false;
}

export class ProductServiceFeePriceTier {

    public Id: number = 0;
    public idProductServiceFee: number = 0;
    public IsAdditional: boolean = false;
    public PFKInStorePickupValue: number = 0;
    public PFKShipToHomeValue: number = 0;
    public Qualifier: number = 0;
    public WEBInStorePickupValue: number = 0;
    public WEBShipToHomeValue: number = 0;
}

