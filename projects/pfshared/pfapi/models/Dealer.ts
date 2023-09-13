


import { Store } from "./Store";
import { CustomContent } from "./CustomContent";
import { DealerOptions } from "./DealerOptions";
import { PaymentProcessor } from "./PaymentProcessor";
import { ServiceChargeFeeType } from "./ServiceChargeFeeType";
import { PaymentProvider } from "./PaymentProvider";



export class Dealer {
    
    public Address: string = "";
    public City: string = "";
    public ClosestStore: Store = null;
    public Code: string = "";
    public CompanyWebsite: string = "";
    public ContactName: string = "";
    public ContactPhone: string = "";
    public Country: string = "";
    public Currency: string = "";
    public CustomContent: CustomContent[] = [];
    public Email: string = "";
    public FeatureSwitchValues: { [key: string]: number; } = {};
    public HeaderLogo: string = "";
    public Id: number = 0;
    public Name: string = "";
    public Options: DealerOptions = null;
    public PaymentProcessors: PaymentProcessor[] = [];
    public Phone: string = "";
    public ServiceChargeFee: number = 0;
    public ServiceChargeFeeType: ServiceChargeFeeType = ServiceChargeFeeType.Unknown;
    public State: string = "";
    public Tags: string = "";
    public ThumbnailLogo: string = "";
    public TotalStores: number = 0;
    public VirtualDirectory: string = "";
    public Website: string = "";
    public Zip: string = "";
    public PrintBorderOption: boolean = false;
    public PaymentProviders: PaymentProvider[] = [];
    public RequiresBillingAddressForPayment: boolean = false;
}


