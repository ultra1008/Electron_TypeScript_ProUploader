


import { PaymentMethod } from "./PaymentMethod";



export class PaymentDetail {
    
    public Amount: number = 0;
    public AuthCode: string = "";
    public AvsCode: string = "";
    public Date: Date = new Date(0);
    public ErrorCode: string = "";
    public ErrorMessage: string = "";
    public ExtendedTransactionId: string = "";
    public PaymentMethod: PaymentMethod = null;
    public PayPalPayerId: string = "";
    public PayPalToken: string = "";
    public ProcessorFee: number = 0;
    public Status: string = "";
    public TransactionId: string = "";
    public VendorTransactionId: string = "";
}


