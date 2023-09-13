





export class Kiosk {
    
    public ClientVersion: string = "";
    public CompanyName: string = "";
    public DateInstalled: Date = new Date(0);
    public DealerCode: string = "";
    public HardwareId: string = "";
    public Id: number = 0;
    public idDealer: number = 0;
    public idLocation: number = 0;
    public IsLicenseActive: boolean = false;
    public LastActivation: Date | null = null;
    public LastActivationResult: number = 0;
    public LastActivationSessionId: string = "00000000-0000-0000-0000-000000000000";
    public LastCheckIn: Date | null = null;
    public LicenseEndDate: Date = new Date(0);
    public LicenseStartDate: Date = new Date(0);
    public StoreName: string = "";
    public StoreNumber: string = "";
}


