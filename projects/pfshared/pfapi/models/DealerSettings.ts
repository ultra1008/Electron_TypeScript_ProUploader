





import { PrePaymentRule } from "./PrePaymentRule";



import { ServiceChargeFeeType } from "./ServiceChargeFeeType";


import { StockCollectionsAvailability } from "./StockCollectionsAvailability";




export class CustomerBillingFields {
    
    public Address: CustomerBillingFieldSettings = null;
    public City: CustomerBillingFieldSettings = null;
    public Country: CustomerBillingFieldSettings = null;
    public Email: CustomerBillingFieldSettings = null;
    public FirstName: CustomerBillingFieldSettings = null;
    public LastName: CustomerBillingFieldSettings = null;
    public Phone: CustomerBillingFieldSettings = null;
    public PostalCode: CustomerBillingFieldSettings = null;
    public StateOrProvince: CustomerBillingFieldSettings = null;
}

export class CustomerBillingFieldSettings {
    
    public Required: boolean = false;
    public Show: boolean = false;
}

export class CustomerFieldsSettings {
    
    public CustomerBillingFieldsPerPlatform: { [key: string]: CustomerBillingFields; } = {};
    public CreditCardPaymentRequiresFullBillingAddress: boolean = false;
}

export class DealerSettings {
    
    public CustomerFields: CustomerFieldsSettings = null;
    public Financial: FinancialSettings = null;
    public Fulfillment: FulfillmentSettings = null;
    public OrderFees: OrderFeeSettings = null;
    public SiteInformation: SiteInformationSettings = null;
    public StockCollections: StockCollectionSettings = null;
}

export class FinancialSettings {
    
    public Currency: string = "";
    public DatabaseTaxEnabled: boolean = false;
    public PrePaymentLimit: number | null = null;
    public PrePaymentOption: PrePaymentRule = PrePaymentRule.RequiredAlways;
}

export class FulfillmentSettings {
    
    public ProductExclusionTags: string = "";
    public ProductInclusionTags: string = "";
}

export class OrderFeeSettings {
    
    public RushOrderDescription: string = "";
    public RushOrderEmail: string = "";
    public RushOrderFee: number | null = null;
    public RushOrderLabel: string = "";
    public ServiceChargeFee: number | null = null;
    public ServiceChargeFeeType: ServiceChargeFeeType = ServiceChargeFeeType.Unknown;
    public ServiceChargeFeeWaiveForZero: boolean = false;
}

export class SiteInformationSettings {
    
    public MetaDescription: string = "";
    public SiteName: string = "";
}

export class StockCollectionSettings {
    
    public Availability: StockCollectionsAvailability = StockCollectionsAvailability.Unknown;
    public CollectionIds: string[] = [];
}


