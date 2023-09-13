


import { OrderNotification } from "./OrderNotification";
import { OrderLineItem } from "./OrderLineItem";
import { OrderSource } from "./OrderSource";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentDetail } from "./PaymentDetail";
import { Store } from "./Store";
import { Product } from "./Product";
import { OrderShipment } from "./OrderShipment";
import { StoredValueCard } from "./StoredValueCard";
import { TrackingInfo } from "./TrackingInfo";
import { UnshippedItem } from "./UnshippedItem";
import { OrderSummary } from "./OrderSummary";
import { ProductServiceFee } from "./ProductServiceFee";

import { OrderRouting } from "./OrderRouting";
import { ShippingOption } from "./ShippingOption";





export class Order extends OrderSummary {

    public AvailableCredit: number = 0;
    public BasketAlbumId: string = "";
    public BasketId: string = "00000000-0000-0000-0000-000000000000";
    public BillToAddress: string = "";
    public BillToCity: string = "";
    public BillToCompany: string = "";
    public BillToCountry: string = "";
    public BillToCounty: string = "";
    public BillToEmail: string = "";
    public BillToFirstName: string = "";
    public BillToLastName: string = "";
    public BillToPhone: string = "";
    public BillToState: string = "";
    public BillToZip: string = "";
    public Coupons: string[] = [];
    public CustomerId: string = "";
    public DateCompleted: Date | null = null;
    public DateCreated: Date | null = null;
    public DateModified: Date | null = null;
    public DollarCardTotal: number = 0;
    public Gift: boolean = false;
    public GiftCardTotal: number = 0;
    public GiftText: string = "";
    public IsMembershipSignup: boolean = false;
    public Notification: OrderNotification = null;
    public OrderLineItems: OrderLineItem[] = [];
    public OrderSource: OrderSource = OrderSource.Any;
    public PaymentOptions: PaymentMethod[] = [];
    public Payments: PaymentDetail[] = [];
    public PickupLocation: Store = null;
    public Products: Product[] = [];
    public ProductServiceFees: ProductServiceFee[] = [];
    public Shipments: OrderShipment[] = [];
    public ShipToAddress: string = "";
    public ShipToCity: string = "";
    public ShipToCompany: string = "";
    public ShipToCountry: string = "";
    public ShipToCounty: string = "";
    public ShipToEmail: string = "";
    public ShipToFirstName: string = "";
    public ShipToLastName: string = "";
    public ShipToPhone: string = "";
    public ShipToState: string = "";
    public ShipToZip: string = "";
    public SourceApplication: string = "";
    public SpecialInstructions: string = "";
    public Status: number = 0;
    public StatusText: string = "";
    public StoredValueCards: StoredValueCard[] = [];
    public Stores: Store[] = [];
    public TotalsByProductType: { [key: string]: number; } = {};
    public TrackingInfo: TrackingInfo[] = [];
    public UnshippedItems: UnshippedItem[] = [];
}


