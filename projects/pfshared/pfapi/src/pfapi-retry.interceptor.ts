import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler, HttpParams } from "@angular/common/http";
import { Observable, filter } from "rxjs";
import { retryBackoff } from 'backoff-rxjs';

const INITIAL_INTERVAL_MS = 500;    // 500 ms
const MAX_INTERVAL_MS = 20 * 1000;  // 20 sec

@Injectable()
export class PFApiRetryInterceptor implements HttpInterceptor {
  private readonly retryErrors: number[] = [-1, 503, 504];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // proceed when there is a response; ignore other events
      filter(event => event instanceof HttpResponse),
      retryBackoff({
        initialInterval: INITIAL_INTERVAL_MS,
        maxInterval: MAX_INTERVAL_MS,
        maxRetries: 10,
        resetOnSuccess: false,
        shouldRetry: (error) => {
          if (error.status) {
            return this.retryErrors.includes(error.status);
          }
          return false;
        },
      }),
    );
  }
}