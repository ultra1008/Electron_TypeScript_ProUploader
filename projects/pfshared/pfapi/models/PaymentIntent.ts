





export class PaymentIntent {
    
    public idPaymentIntent: number = 0;
    public ProcessorsPaymentId: string = "";
    public idBasket: string = "00000000-0000-0000-0000-000000000000";
    public idOrder: number = 0;
    public DateConfirmed: Date | null = null;
    public DealerCode: string = "";
    public Amount: number = 0;
    public ShortUniqueId: string = "";
    public Currency: string = "";
    public Language: string = "";
    public ProcessorName: string = "";
    public PaymentHandle: string = "";
    public PaymentUrl: string = "";
    public ContinueUrl: string = "";
    public CancelUrl: string = "";
    public WillCaptureWithAuth: boolean = false;
    public FullServerResponse: string = "";
    public NonCardStatementText: string = "";
    public StatementTextSuffix: string = "";
}


