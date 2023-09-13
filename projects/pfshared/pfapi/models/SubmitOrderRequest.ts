


import { PaperFinish } from "./PaperFinish";
import { Order } from "./Order";
import { OrderRouting } from "./OrderRouting";
import { PaymentInfo } from "./PaymentInfo";
import { ProductSchemes } from "./ProductSchemes";



export class SubmitOrderRequest {
    constructor() {
			this.PaymentInfo = new PaymentInfo();
		}

    public AddPrintBorder: boolean = false;
    public Finish: PaperFinish = PaperFinish.None;
    public Order: Order = null;
    public OrderRouting: OrderRouting = OrderRouting.Cloud;
    public PaymentInfo: PaymentInfo = null;
    public ProductScheme: ProductSchemes = ProductSchemes.ProductCategory;
    public SendEmail: boolean = false;
    public SourceApplication: string = "";
    public Token: string = "";
}


