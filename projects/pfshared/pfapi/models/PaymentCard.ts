





export class PaymentCard {
    constructor() {
			this.ExpirationMonth = undefined;
			this.ExpirationYear = undefined;
		}

    public AccountNumber: string = "";
    public Amount: number = 0;
    public Ccv: string = "";
    public ExpirationMonth: number = 0;
    public ExpirationYear: number = 0;
    public PaymentMethodId: number = 0;
}


