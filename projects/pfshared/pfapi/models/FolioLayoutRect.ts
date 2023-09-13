


import { FolioLayoutRectTypes } from "./FolioLayoutRectTypes";



export class FolioLayoutRect {
    constructor() {
			this.Index = -1;
			this.Type = FolioLayoutRectTypes.Unknown;
		}

    public Height: number = 0;
    public Index: number = 0;
    public IsMetric: boolean = false;
    public Left: number = 0;
    public Rotation: number = 0;
    public Top: number = 0;
    public Type: FolioLayoutRectTypes = FolioLayoutRectTypes.Unknown;
    public Unmoveable: boolean = false;
    public Width: number = 0;
}


