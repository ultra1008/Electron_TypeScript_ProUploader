




export const enum ShippingStatus {
    None = 0,
    Pending = 1,
    NotFound = 2,
    InTransit = 3,
    OutForDelivery = 4,
    Delivered = 5,
    Undelivered = 6,
    Exception = 7,
    Expired = 8
}

export const enum ShippingNotFound {
    NoInfo = 9,
    WaitingForPickup = 10
}

export const enum ShippingException {
    TrackingInfoNeverArrived = 11,
    StoppedProgressing = 12,
    NeverDelivered = 13,
    Unclaimed = 14,
    Refused = 15,
    Customs = 16,
    Damaged = 17,
    Cancelled = 18
}

