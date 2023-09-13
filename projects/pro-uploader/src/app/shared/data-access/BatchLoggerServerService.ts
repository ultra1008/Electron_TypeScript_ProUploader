import {
  bufferCount,
  bufferTime,
  catchError,
  concatMap,
  filter,
  map,
  Observable,
  of,
  race,
  Subject
} from 'rxjs';
import {
  HttpBackend,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { INGXLoggerConfig, INGXLoggerMetadata, NGXLoggerServerService } from 'ngx-logger';
import { Injectable } from '@angular/core';

export interface IBatchLoggerConfig extends INGXLoggerConfig {
  serverLoggingBufferCount?: number;
  serverLoggingBufferTime?: number;
}

@Injectable()
export class BatchLoggerServerService extends NGXLoggerServerService {
  constructor(
    private backend: HttpBackend
  ) {
    super(backend);
  }

  private config: IBatchLoggerConfig;
  private logEventCache$$: Subject<INGXLoggerMetadata> = new Subject<INGXLoggerMetadata>();

  /** NGXLoggerServerService method, not used for this implementation */
  override sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    if (!this.config) {
      this.config = config;
      this.initLogging();
    }
    this.logOnServer(this.config.serverLoggingUrl, metadata);
  }

  override logOnServer(url: string, logContent: INGXLoggerMetadata): Observable<any> {
    this.logEventCache$$.next(logContent);
    return of(null);
  }

  private initLogging() {
    console.log(`sending logs also to server every ${this.config.serverLoggingBufferTime} seconds or ${this.config.serverLoggingBufferCount} messages`);

    const source$ = this.logEventCache$$.asObservable();

    // After x seconds have passed, emit buffered values as an array
    const bufferedByTime$ = source$.pipe(bufferTime(this.config.serverLoggingBufferCount));

    // After x count added, emit buffered values as an array
    const bufferedByCount$ = source$.pipe(bufferCount(this.config.serverLoggingBufferTime * 1000));

    // Send buffered logs to server
    race(bufferedByTime$, bufferedByCount$).pipe(
      filter(x => x.length > 0)
    ).subscribe(x => this.sendBatchToServer(x, this.config));
  }

  private sendBatchToServer(logs: Array<INGXLoggerMetadata>, config: INGXLoggerConfig): void {
    const headers = config.customHttpHeaders || new HttpHeaders();
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const params = config.customHttpParams || new HttpParams();
    const responseType = config.httpResponseType || 'json';

    let defaultRequest = new HttpRequest<any>('POST', config.serverLoggingUrl, logs, { headers, params, responseType });
    let finalRequest: Observable<HttpRequest<any>> = of(defaultRequest);

    finalRequest.pipe(
      concatMap(req => this.httpBackend.handle(req)),
      filter(e => e instanceof HttpResponse),
      map<HttpResponse<any>, any>((httpResponse: HttpResponse<any>) => httpResponse.body)
    ).pipe(catchError(err => {
      // Do not use NGXLogger here because this could cause an infinite loop 
      console.error('BatchLoggerServerService: Failed to log on server', err);
      return of(null);
    })).subscribe();
  }
}
