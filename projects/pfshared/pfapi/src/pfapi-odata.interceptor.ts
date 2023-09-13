import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable()
export class PFApiODataInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map(response => {
        if (request.method == "GET" && response instanceof HttpResponse) {
          // convert ODATA paged requests with an $inlinecount query arg to an array with a $$count property
          if (typeof response.body.Count !== "undefined" && (typeof response.body.Results !== "undefined" || typeof response.body.Items !== "undefined")) {
            let newBody = response.body.Results || response.body.Items;
            newBody.$$count = response.body.Count;

            return response.clone({
              body: newBody
            });
          }
        }

        return response;
      })
    );
  }
}