

import { FolioImage } from "./FolioImage";
import { FolioItem } from "./FolioItem";

import { FolioItemTypes } from "./FolioItemTypes";





export class FolioBackgroundItem extends FolioItem {
    constructor() {
			super();
			this.Image = new FolioImage();
			this.Type = FolioItemTypes.Background;
		}

    public Image: FolioImage = null;
}


