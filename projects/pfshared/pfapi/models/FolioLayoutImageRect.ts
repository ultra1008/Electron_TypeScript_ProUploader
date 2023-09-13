


import { FolioBorder } from "./FolioBorder";
import { FolioLayoutRect } from "./FolioLayoutRect";

import { FolioLayoutRectTypes } from "./FolioLayoutRectTypes";





export class FolioLayoutImageRect extends FolioLayoutRect {
    constructor() {
			super();
			this.PhotoBorder = new FolioBorder();
			this.Type = FolioLayoutRectTypes.Image;
		}

    public Alias: string = "";
    public BackgroundColor: string = "";
    public IsWhiteScreen: boolean = false;
    public MaskImageUrl: string = "";
    public MaskPhotoId: number = 0;
    public Path: string = "";
    public PhotoBorder: FolioBorder = null;
    public PreserveAspect: boolean = false;
}


