import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { Collection } from "pfshared/pfapi";
import { OrderUploadEx } from "../data-access/order-upload.model";

@Pipe({
  name: "photoCount",
  pure: false
})
export class PhotoCountPipe implements PipeTransform {
  transform(orderUpload: OrderUploadEx, collection?: Partial<Collection>): number {
    return collection
      ? Object.values(orderUpload.files).filter(f => f.idCollection === collection.Id).length
      : Object.keys(orderUpload.files).length;
  }
}

@NgModule({
  imports: [],
  declarations: [PhotoCountPipe],
  exports: [PhotoCountPipe],
})
export class PhotoCountPipeModule { }

