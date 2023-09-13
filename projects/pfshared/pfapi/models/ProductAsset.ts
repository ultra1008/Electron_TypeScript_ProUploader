export enum ProductAssetActionType {
  AttachToOrder = "AttachToOrder",
  EmailToCustomer = "EmailToCustomer"
}

export enum ProductAssetType {
  DealerAsset = "DealerAsset",
  ProductRendering = "ProductRendering"
}

export class ProductAsset {
  public Asset: ProductAssetAsset = new ProductAssetAsset();
  public Action: ProductAssetAction = new ProductAssetAction();
  public DateModified: Date;
  public Id: string;
}

export class ProductAssetAction {
  public ActionType: ProductAssetActionType;
  public Options: string;
}

export class ProductAssetAsset {
  public AssetType: ProductAssetType;
  public Options: string;
}

// Action Options
export class AttachToOrderOptions {
  public ActionType: ProductAssetActionType = ProductAssetActionType.AttachToOrder;
  public ExportAsProduct: boolean = false;
  public ExportProductId: number;
  public OrderLimit: number = 0;
  public PrintAsInvoice: boolean = false;
  public RepeatForQuantity: boolean = false;
}

export class EmailToCustomerOptions {
  public ActionType: ProductAssetActionType = ProductAssetActionType.EmailToCustomer;
}

// Asset Options
export class DealerAssetOptions {
  public AssetType: ProductAssetType = ProductAssetType.DealerAsset;
  public AssetId: number;
}

export class ProductRenderingOptions {
  public AssetType: ProductAssetType = ProductAssetType.ProductRendering;
  public DPI: number = 120;
  public ExcludeBackground: boolean = false;
  public FileNamePrefix: string;
  public InhibitOutputSection: boolean = true;
}