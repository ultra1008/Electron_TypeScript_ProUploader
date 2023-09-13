


import { FolioItemTypes } from "./FolioItemTypes";



export class FolioItem {
    constructor() {
			this.Type = FolioItemTypes.Unknown;
		}

    public ApmHeight: string = "";
    public ApmLeft: string = "";
    public ApmTop: string = "";
    public ApmWidth: string = "";
    public BackgroundColor: string = "";
    public BackgroundOpacity: number = 0;
    public Height: number = 0;
    public HideInstructions: boolean = false;
    public Index: number = 0;
    public IsMetric: boolean = false;
    public Left: number = 0;
    public Moveable: boolean = false;
    public Top: number = 0;
    public Type: FolioItemTypes = FolioItemTypes.Unknown;
    public Width: number = 0;
}


