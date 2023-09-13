


import { FolioLayoutImageRect } from "./FolioLayoutImageRect";
import { FolioLayoutOverlay } from "./FolioLayoutOverlay";
import { FolioBorder } from "./FolioBorder";
import { FolioLayoutTextRect } from "./FolioLayoutTextRect";



export class FolioLayout {
    
    public AllowFreeForm: boolean = false;
    public Height: number = 0;
    public ImageRects: FolioLayoutImageRect[] = [];
    public IsBlank: boolean = false;
    public IsCustom: boolean = false;
    public IsDisabled: boolean = false;
    public IsMetric: boolean = false;
    public IsPrivate: boolean = false;
    public LayoutId: number = 0;
    public LockPhotoZOrder: boolean = false;
    public Overlay: FolioLayoutOverlay = null;
    public PhotoBorder: FolioBorder = null;
    public ProhibitFreeForm: boolean = false;
    public TextRects: FolioLayoutTextRect[] = [];
    public ThumbnailImageId: number = 0;
    public ThumbnailImageUrl: string = "";
    public Width: number = 0;
}


