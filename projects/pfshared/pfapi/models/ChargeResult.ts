export enum ChargeResultCodes {
  NoProvider = 0,
  Success = 1,
  SoftwareFailure = 2,
  PaymentFailure = 3,
  NotImplemented = 4
}

export class ChargeResult {
  public Amount: number = 0;
  public AuthCode: string = "";
  public AvsCode: string = "";
  public AvsMessage: string = "";
  public ErrorCode: string = "";
  public ErrorMessage: string = "";
  public PayPalPayerID: string = "";
  public PayPalToken: string = "";
  public ProviderFee: number = 0;
  public ResultCode: ChargeResultCodes = ChargeResultCodes.NoProvider;
  public SecurityKey: string = "";
  public SuccessMessage: string = "";
  public Timestamp: Date = new Date(0);
  public TransactionId: string = "";
  public VendorTransactionId: string = "";
}