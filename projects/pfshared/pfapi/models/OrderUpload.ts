import { Collection } from "./Collection";
import { Product } from "./Product";

export enum ShowOrdersWithLocation {
  IncludeAllStoreOrders = 0,
  IncludeOrdersWithLocations = 1,
  ExcludeOrdersWithLocation = 2
}

export class OrderUpload {
  AllowImport: boolean = true;
  BagNumber?: string;
  ClaimCode?: string;
  Collections?: Partial<Collection>[] = [];
  DateCreatedUtc?: Date;
  DateEmailedUtc?: Date;
  DatePurgedUtc?: Date;
  DateUploadedUtc?: Date;
  DateViewedUtc?: Date;
  Email?: string;
  FirstName?: string;
  Id: string = '';
  idDealer: number = 0;
  idLocation: number = 0;
  idOrder: number = 0;
  LastName?: string;
  Products?: Partial<Product>[] = [];
  SendEmail: boolean = true;
}