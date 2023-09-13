

import { FolioImage } from "./FolioImage";
import { FolioItem } from "./FolioItem";

import { FolioItemTypes } from "./FolioItemTypes";





export class FolioFrameItem extends FolioItem {
    constructor() {
			super();
			this.Image = new FolioImage();
			this.Type = FolioItemTypes.Frame;
		}

    public Image: FolioImage = null;
}


