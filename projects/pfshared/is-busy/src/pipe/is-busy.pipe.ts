import { Pipe, PipeTransform } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { IsBusyService, Key } from "../is-busy.service";

@Pipe({
  name: "IsBusy",
})
export class IsBusyPipe implements PipeTransform {
  constructor(private isBusyService: IsBusyService) {}

  transform(key: Key): Observable<boolean> {
    return this.isBusyService
      .isBusy$({ key })
      .pipe(debounceTime(10), distinctUntilChanged());
  }
}
