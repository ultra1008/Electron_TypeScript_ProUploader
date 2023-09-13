




export const enum OrderStatus {
    New = 0,
    Printed = 1,
    Cancelled = 2,
    Complete = 3,
    Archived = 4,
    None = 5,
    Exported = 6,
    Mixed = 7,
    Incomplete = 8,
    PaymentPending = 9,
    WaitingForPFKioskProcessing = 10,
    PFKioskProcessingComplete = 11,
    Submitted = 12,
    Queued = 13,
    PostProcessing = 14,
    Exception = 15,
    PFKioskRoutingFailure = 16,
    PreparingOrder = 20,
    PreparationComplete = 25,
    ImageCorrection = 30,
    Printing = 35,
    ProductionComplete = 40,
    QualityAssurance = 45,
    QualityAssuranceComplete = 50,
    InTransitToStore = 55,
    NeedsReview = 60,
    PhotoProcessingException = 70,
    Registered = 80
}

