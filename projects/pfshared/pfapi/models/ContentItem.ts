import { ContentItemType } from "./ContentItemType";

export class ContentItem {
  public DateCreated?: Date;
  public DateModified?: Date;
  public Description?: string;
  public Disabled?: boolean;
  public DoNotShare?: boolean;
  public DwellTime?: number;
  public EndDate?: Date;
  public EnterAnimation?: string;
  public ExitAnimation?: string;
  public FileName?: string;
  public FileSize?: number;
  public FileType?: string;
  public FileUrl?: string;
  public Height?: number;
  public idContentItem: number;
  public idDealer?: number;
  public idPhoto?: number;
  public SortOrder?: number;
  public Source?: string;
  public StartDate?: Date;
  public Title?: string;
  public Type?: ContentItemType;
  public Width?: number;
}