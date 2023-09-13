

import { FeaturedCategoryProductType } from "./FeaturedCategoryProductType";

import { FeaturedItemType } from "./FeaturedItemType";



export class FeaturedItem {
    
    public CategoryProductType: FeaturedCategoryProductType = FeaturedCategoryProductType.Print;
    public Description: string = "";
    public Id: number = 0;
    public Name: string = "";
    public PreviewUrl: string = "";
    public SortOrder: number = 0;
    public Type: FeaturedItemType = FeaturedItemType.Category;
}


