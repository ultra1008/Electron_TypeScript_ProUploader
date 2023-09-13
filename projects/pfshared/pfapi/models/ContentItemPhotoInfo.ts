import { ContentItem } from "./ContentItem";
import { ContentItemPhotoInfoType } from "./ContentItemPhotoInfoType";

export class ContentItemPhotoInfo extends ContentItem {
  public ContentType: ContentItemPhotoInfoType;
  public PhotoUrl: string;
}
