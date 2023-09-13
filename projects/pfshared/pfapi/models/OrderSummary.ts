


import { OrderRouting } from "./OrderRouting";
import { ShippingOption } from "./ShippingOption";



export class OrderSummary {

    public AllowPickup: boolean = false;
    public AllowShipping: boolean = false;
    public AmountPaid: number = 0;
    public AppliedCredit: number = 0;
    public BalanceDue: number = 0;
    public ClientVersion: string = "";
    public Discount: number = 0;
    public idDealer: number = 0;
    public idOrder: number = 0;
    public idPickupLocation: number | null = null;
    public idUser: number = 0;
    public KioskFulfillment: string = "";
    public KioskId: number | null = null;
    public Language: string = "";
    public PhysicalProductCount: number = 0;
    public ProductFees: number | null = null;
    public PromiseTime: Date | null = null;
    public RefundIssueDate: Date | null = null;
    public RequiresBillingAddressForPayment: boolean = false;
    public RequiresPayment: boolean = false;
    public Routing: OrderRouting = OrderRouting.Cloud;
    public RushOrder: boolean = false;
    public RushOrderFee: number = 0;
    public ServiceCharge: number = 0;
    public ShipOrder: boolean = false;
    public ShippingMethod: string = "";
    public ShippingOptions: ShippingOption[] = [];
    public ShippingTotal: number = 0;
    public SubTotal: number = 0;
    public Tax: number = 0;
    public Token: string = "";
    public Total: number = 0;
    public TotalRefunds: number = 0;
}


