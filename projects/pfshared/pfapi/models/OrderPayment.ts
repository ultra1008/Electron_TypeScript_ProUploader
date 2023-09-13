


import { PaymentMethod } from "./PaymentMethod";



export class OrderPayment {
    
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
    public PaymentOptions: PaymentMethod[] = [];
    public RequiresBillingAddressForPayment: boolean = false;
    public RequiresPayment: boolean = false;
    public Validate: boolean = false;
}


