


import { OrderNotificationType } from "./OrderNotificationType";



export class OrderNotification {
    
    public CleansedPhoneNumberE164: string = "";
    public DateSent: Date | null = null;
    public Name: string = "";
    public Recipient: string = "";
    public Type: OrderNotificationType = OrderNotificationType.None;
}


