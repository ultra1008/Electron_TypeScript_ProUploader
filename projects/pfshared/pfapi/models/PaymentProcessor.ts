


import { PaymentProvider } from "./PaymentProvider";



export class PaymentProcessor {
    
    public AutoCharge: boolean | null = null;
    public AccountId: string = "";
    public Id: number = 0;
    public OrderSubmitAction: number | null = null;
    public PaymentProvider: PaymentProvider = PaymentProvider.NotSpecified;
}


