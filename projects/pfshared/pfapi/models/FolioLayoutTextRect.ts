

import { FolioHorizontalAlignment } from "./FolioHorizontalAlignment";

import { FolioTextOrientation } from "./FolioTextOrientation";
import { FolioVerticalAlignment } from "./FolioVerticalAlignment";
import { FolioLayoutRect } from "./FolioLayoutRect";

import { FolioLayoutRectTypes } from "./FolioLayoutRectTypes";





export class FolioLayoutTextRect extends FolioLayoutRect {
    constructor() {
			super();
			this.Align = FolioHorizontalAlignment.Center;
			this.FontName = "Times New Roman";
			this.FontSizeInPoints = 18;
			this.FontColor = "#000000";
			this.Orientation = FolioTextOrientation.Horizontal;
			this.Type = FolioLayoutRectTypes.Text;
			this.VerticalAlign = FolioVerticalAlignment.Center;
		}

    public Align: FolioHorizontalAlignment = FolioHorizontalAlignment.Unknown;
    public BackgroundColor: string = "";
    public FontColor: string = "";
    public FontName: string = "";
    public FontSizeInPoints: number = 0;
    public HideInstructionText: boolean = false;
    public IsBold: boolean = false;
    public IsItalic: boolean = false;
    public IsLocked: boolean = false;
    public LanguageSection: string = "";
    public Orientation: FolioTextOrientation = FolioTextOrientation.Horizontal;
    public Text: string = "";
    public VerticalAlign: FolioVerticalAlignment = FolioVerticalAlignment.Unknown;
}


