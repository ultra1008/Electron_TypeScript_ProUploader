

import { PaymentCard } from "./PaymentCard";
import { PaymentOptions } from "./PaymentOptions";



export class PaymentInfo {
    constructor() {
			this.PaymentCard = new PaymentCard();
			this.PaymentOption = PaymentOptions.None;
		}

    public PaymentCard: PaymentCard = null;
    public PaymentOption: PaymentOptions = PaymentOptions.None;
}


