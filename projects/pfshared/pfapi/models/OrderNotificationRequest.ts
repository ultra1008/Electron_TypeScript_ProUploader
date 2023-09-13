


import { OrderNotificationType } from "./OrderNotificationType";



export class OrderNotificationRequest {
    
    public idOrder: number = 0;
    public RecipientIdentifier: string = "";
    public Type: OrderNotificationType = OrderNotificationType.None;
}


