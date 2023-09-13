


import { OrderLineItemPhoto } from "./OrderLineItemPhoto";
import { OrderLineItemPriceBreakdown } from "./OrderLineItemPriceBreakdown";
import { ProjectSummary } from "./ProjectSummary";
import { TrackingInfo } from "./TrackingInfo";



export class OrderLineItem {

    public AdditionalPageCount: number | null = null;
    public AdjustedTotal: number = 0;
    public DateCancelled: Date | null = null;
    public DateCompleted: Date | null = null;
    public DatePrinted: Date | null = null;
    public idCancelledLocation: number | null = null;
    public idCompletedLocation: number | null = null;
    public idOrderLineItem: number = 0;
    public idPrintedLocation: number | null = null;
    public idProduct: number | null = null;
    public idProductCategory: number | null = null;
    public idProductServiceFee: number | null = null;
    public FulfillmentId: number | null = null;
    public OrderLineItemPhoto: OrderLineItemPhoto[] = [];
    public ParentUniqueId: string | null = "00000000-0000-0000-0000-000000000000";
    public PersonalizationText: string = "";
    public PersonalizationFee: number = 0;
    public PersonalizationFeeAdditional: number = 0;
    public Pricing: OrderLineItemPriceBreakdown[] = [];
    public ProductFee: number | null = null;
    public ProjectId: string | null = "00000000-0000-0000-0000-000000000000";
    public ProjectSummary: ProjectSummary = null;
    public Quantity: number = 0;
    public Status: number = 0;
    public StatusText: string = "";
    public Total: number = 0;
    public TrackingInfo: TrackingInfo = null;
    public UniqueId: string = "00000000-0000-0000-0000-000000000000";
    public UnitPrice: number | null = null;
    public WholesaleCost: number | null = null;
}


