


import { FolioBackground } from "./FolioBackground";
import { FolioDuplexType } from "./FolioDuplexType";
import { FolioCroppingGuide } from "./FolioCroppingGuide";
import { FolioLayout } from "./FolioLayout";
import { FolioPage } from "./FolioPage";



export class ProjectTemplate {
    
    public AllowFreeForm: boolean = false;
    public Backgrounds: { [key: number]: FolioBackground; } = {};
    public DuplexType: FolioDuplexType = FolioDuplexType.NotDuplexed;
    public FolioCroppingGuides: { [key: string]: FolioCroppingGuide; } = {};
    public FolioOutputSpec: string = "";
    public Height: number = 0;
    public IncludeCoverPages: boolean = false;
    public Layouts: { [key: number]: FolioLayout; } = {};
    public MasterProductId: number = 0;
    public IsMetric: boolean = false;
    public PageCount: number = 0;
    public PageIncrementCount: number = 0;
    public PageMax: number = 0;
    public PageMin: number = 0;
    public Pages: { [key: number]: FolioPage; } = {};
    public PhotoSelectionMaximum: number = 0;
    public PhotoSelectionMinimum: number = 0;
    public PhotoSelectionRecommended: number = 0;
    public ProductCategoryId: number = 0;
    public ProductId: number = 0;
    public ProductName: string = "";
    public StyleId: number = 0;
    public StyleName: string = "";
    public StyleTags: string[] = [];
    public Width: number = 0;
}


