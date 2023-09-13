


import { Distance } from "./Distance";



export class Store {
    
    public Active: boolean = false;
    public Address1: string = "";
    public Address2: string = "";
    public AllowsPickup: boolean = false;
    public City: string = "";
    public CompanyWebsite: string = "";
    public Country: string = "";
    public DealerName: string = "";
    public DealerWebsite: string = "";
    public Distance: Distance = null;
    public Email: string = "";
    public Fax: string = "";
    public Hours: string = "";
    public Id: number = 0;
    public Info: string = "";
    public Latitude: number = 0;
    public Longitude: number = 0;
    public Name: string = "";
    public Phone: string = "";
    public Region: string = "";
    public RequirePrepayment: boolean = false;
    public SortOrder: number = 0;
    public State: string = "";
    public StoreNumber: string = "";
    public TaxRate: number | null = null;
    public TaxShipping: boolean = false;
    public TaxStates: string[] = [];
    public Zip: string = "";
}


