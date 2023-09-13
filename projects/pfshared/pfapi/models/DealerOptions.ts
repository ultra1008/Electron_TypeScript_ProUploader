


import { MediaProductOptions } from "./MediaProductOptions";
import { RushOrderOptions } from "./RushOrderOptions";
import { StoreLoyaltyCardOptions } from "./StoreLoyaltyCardOptions";



export class DealerOptions {
    
    public Demandware: boolean = false;
    public DpiThreshold: number = 0;
    public EnableImglyEditor: boolean = false;
    public EnableKioskCloudProviders: boolean = false;
    public EnableWebCloudProviders: boolean = false;
    public ExpressUploadDpi: number = 0;
    public ExternalContentEnabled: boolean = false;
    public FastUploadDpi: number = 0;
    public GiftOption: boolean = false;
    public HideCountryOnDelivery: boolean = false;
    public HidePrintCroppingOptions: boolean = false;
    public HideTaxWhenZero: boolean = false;
    public MaxUploadDisplayFileSize: string = "";
    public MaxUploadFileSize: number = 0;
    public MediaProduct: MediaProductOptions = null;
    public MobileNotificationOrigination: string = "";
    public OfferPrePaymentOnlyWhenRequired: boolean = false;
    public PFKioskMinimumVersion: string = "";
    public PFKioskReleaseVersion: string = "";
    public PostalAddressValidation: boolean = false;
    public PreventMultipleCoupons: boolean = false;
    public PrintBorderOption: boolean = false;
    public RequiresBillingAddressForPayment: boolean = false;
    public RushOrder: RushOrderOptions = null;
    public ShipmentTracking: boolean = false;
    public ShowCompanyOnDelivery: boolean = false;
    public SkipPickupIfASingleStore: boolean = false;
    public SpecialInstructionsOption: boolean = false;
    public StoreLoyaltyCard: StoreLoyaltyCardOptions = null;
    public StripeLegacyWorkflow: boolean = false;
}


