


import { FolioBorder } from "./FolioBorder";
import { FolioEffect } from "./FolioEffect";
import { FolioImage } from "./FolioImage";
import { FolioSourcePercentRect } from "./FolioSourcePercentRect";
import { FolioTranslate } from "./FolioTranslate";
import { FolioItem } from "./FolioItem";

import { FolioItemTypes } from "./FolioItemTypes";





export class FolioPhotoItem extends FolioItem {
    
    public Alias: string = "";
    public AspectCorrect: boolean = false;
    public Border: FolioBorder = null;
    public Effects: FolioEffect[] = [];
    public FullResPhotoHeight: number = 0;
    public FullResPhotoWidth: number = 0;
    public Image: FolioImage = null;
    public ImageRotation: number = 0;
    public IsBackground: boolean = false;
    public Opacity: number = 0;
    public Rotation: number = 0;
    public Scale: number = 0;
    public ScreenUrl: string = "";
    public SourcePercentRect: FolioSourcePercentRect = null;
    public SourceUrl: string = "";
    public ThumbnailUrl: string = "";
    public Translate: FolioTranslate = null;
    public zIndex: number = 0;
}


