import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { OrderUpload } from "pfshared/pfapi/public-api";

@Pipe({
  name: "twinCheck"
})
export class TwinCheckPipe implements PipeTransform {
  transform(orderUpload: OrderUpload): string {
    let twinChecks = orderUpload.Collections.map(c => c.Description).filter(t => t);

    return twinChecks.join(", ");
  }
}

@NgModule({
  imports: [],
  declarations: [TwinCheckPipe],
  exports: [TwinCheckPipe],
})
export class TwinCheckPipeModule { }

