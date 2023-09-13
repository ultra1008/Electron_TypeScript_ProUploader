


import { CreditCardType } from "./CreditCardType";
import { PaymentMethodType } from "./PaymentMethodType";






export class PaymentMethod {
    
    public AccountNumberDigits: number = 0;
    public AccountRanges: AccountRange[] = [];
    public CardType: CreditCardType = CreditCardType.Other;
    public CcvDigits: number = 0;
    public Id: number = 0;
    public MethodType: PaymentMethodType = PaymentMethodType.Unknown;
    public Name: string = "";
    public PinDigits: number = 0;
    public RequireCcv: boolean = false;
    public RequireExpiration: boolean = false;
    public RequirePin: boolean = false;
}

export class AccountRange {
    
    public FirstNumber: number = 0;
    public LastNumber: number = 0;
    public Products: AccountRangeProduct[] = [];
}

export class AccountRangeProduct {
    
    public Name: string = "";
    public ProductId: number = 0;
}


