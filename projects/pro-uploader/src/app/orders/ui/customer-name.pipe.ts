import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { OrderUpload } from "pfshared/pfapi/public-api";

@Pipe({
  name: "customerName"
})
export class CustomerNamePipe implements PipeTransform {
  transform(orderUpload: OrderUpload): string {
    return [ orderUpload.LastName, orderUpload.FirstName ].join(", ");
  }
}

@NgModule({
  imports: [],
  declarations: [CustomerNamePipe],
  exports: [CustomerNamePipe],
})
export class CustomerNamePipeModule { }

