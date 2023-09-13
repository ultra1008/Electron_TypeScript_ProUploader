

import { FolioDocument } from "./FolioDocument";
import { Product } from "./Product";
import { ProjectSummary } from "./ProjectSummary";

import { CreativeStyle } from "./CreativeStyle";





export class Project extends ProjectSummary {
    
    public FolioDocument: FolioDocument = null;
    public Product: Product = null;
}


