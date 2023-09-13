import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { $pf } from "../models/PhotoFinaleContext";

@Injectable()
export class PFApiLanguageInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
      params: (request.params ? request.params : new HttpParams())
        .set("lang", $pf.cultureInfo.name)
    });

    return next.handle(clonedRequest);
  }
}