


import { FolioBackground } from "./FolioBackground";
import { FolioItem } from "./FolioItem";
import { FolioLayout } from "./FolioLayout";



export class FolioPage {
    
    public AvailableBackgroundIds: number[] = [];
    public AvailableLayoutIds: number[] = [];
    public Background: FolioBackground = null;
    public Height: number = 0;
    public IsLocked: boolean = false;
    public IsMetric: boolean = false;
    public Items: FolioItem[] = [];
    public Layout: FolioLayout = null;
    public LimitBackgrounds: boolean = false;
    public LimitLayouts: boolean = false;
    public PageNumber: number = 0;
    public UseBlankBackground: boolean = false;
    public UseBlankLayout: boolean = false;
    public Width: number = 0;
}


