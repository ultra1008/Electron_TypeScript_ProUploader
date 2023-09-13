


import { KdfsStoreHours } from "./KdfsStoreHours";
import { KdfsStoreCoords } from "./KdfsStoreCoords";



export class KdfsStore {
    
    public retailerId: string = "";
    public retailerStoreId: string = "";
    public status: string = "";
    public fulfillment: string = "";
    public name: string = "";
    public country: string = "";
    public state: string = "";
    public city: string = "";
    public zip: string = "";
    public address1: string = "";
    public phone: string = "";
    public email: string = "";
    public timezone: string = "";
    public mon: KdfsStoreHours = null;
    public tue: KdfsStoreHours = null;
    public wed: KdfsStoreHours = null;
    public thu: KdfsStoreHours = null;
    public fri: KdfsStoreHours = null;
    public sat: KdfsStoreHours = null;
    public sun: KdfsStoreHours = null;
    public coords: KdfsStoreCoords = null;
    public products: string[] = [];
}


