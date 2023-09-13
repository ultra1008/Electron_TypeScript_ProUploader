

import { FolioFont } from "./FolioFont";
import { FolioHorizontalAlignment } from "./FolioHorizontalAlignment";

import { FolioTextOrientation } from "./FolioTextOrientation";
import { FolioVerticalAlignment } from "./FolioVerticalAlignment";
import { FolioItem } from "./FolioItem";

import { FolioItemTypes } from "./FolioItemTypes";





export class FolioTextItem extends FolioItem {
    
    public Font: FolioFont = null;
    public HorizontalAlignment: FolioHorizontalAlignment = FolioHorizontalAlignment.Unknown;
    public LineSize: number = 0;
    public Lines: string = "";
    public LocalizationSection: string = "";
    public LocalizationVariable: string = "";
    public Locked: boolean = false;
    public Opacity: number = 0;
    public Orientation: FolioTextOrientation = FolioTextOrientation.Horizontal;
    public Rotation: number = 0;
    public Shadow: boolean = false;
    public TextBackground: boolean = false;
    public Text: string = "";
    public VerticalAlignment: FolioVerticalAlignment = FolioVerticalAlignment.Unknown;
    public zIndex: number = 0;
}


