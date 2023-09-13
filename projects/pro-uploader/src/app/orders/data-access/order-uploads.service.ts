import { $pf, OrderUpload } from 'pfshared/pfapi';
import { AppState } from '@app/shared/state/app.state';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  finalize,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
  take
} from 'rxjs';
import { CacheObservable } from 'pfshared/utility';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IsBusyService } from 'pfshared/is-busy';
import { OrderUploadEx } from './order-upload.model';
import { PhotoCountPipe } from '../ui/photo-count.pipe';
import { selectCurrentSettings } from '@app/settings/data-access/settings.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class OrderUploadsService {
  constructor(
    private $http: HttpClient,
    private busyService: IsBusyService,
    private photoCount: PhotoCountPipe,
    private store: Store<AppState>
  ) { }

  private search$$ = new BehaviorSubject<string>("");
  private refreshing$$ = new BehaviorSubject<boolean>(true);

  private readonly columnsToSearch = ["idOrder", "BagNumber", "TwinCheck", "ClaimCode", "Email", "Customer"];
  private readonly refresh$$ = new ReplaySubject<void>(1);

  private get baseUrl() {
    return `${$pf.apiUrl}/dealers/${$pf.dealer.code}/order-uploads`;
  }

  readonly search$ = this.search$$.asObservable();
  readonly refreshing$ = this.refreshing$$.asObservable();

  orderUploads$ = combineLatest([
    this.store.select(selectCurrentSettings),
    this.refresh$$
  ]).pipe(
    switchMap(([settings]) => {
      this.busyService.add({ key: `refreshing-order-uploads` });

      let params = {
        maxAgeDays: settings.general.maxAgeDays,
        showOrdersWithoutLocation: settings.storeFilter.showOrdersWithoutLocation,
        showOrdersWithLocation: settings.storeFilter.showOrdersWithLocation,
        locations: ""
      };

      if (settings.storeFilter.locations){
        params.locations = settings.storeFilter.locations.join(',')
      }

      return this.$http.get<OrderUpload[]>(this.baseUrl, { params })
        .pipe(
          finalize(() => this.busyService.remove({ key: 'refreshing-order-uploads' }))
        );
    }),
    shareReplay(1)
  );

  //@CacheObservable()
  // getOrderUploads(): Observable<OrderUpload[]> {
  //   return this.$http.get<OrderUpload[]>(this.baseUrl)
  //     .pipe(
  //       shareReplay()
  //     );
  // }

  applySearch(search: string, orderUploads: OrderUploadEx[]): OrderUploadEx[] {
    search = search.toLowerCase();
    return orderUploads?.filter(o => {
      if (search) {
        const BreakError = {};
        let match = false;

        try {
          this.columnsToSearch.forEach(column => {
            switch (column) {
              case "TwinCheck":
                o.Collections.forEach(c => {
                  if (c.Description?.toLowerCase().includes(search)) {
                    match = true;
                    throw BreakError;
                  }
                });
                break;

              case "Customer":
                if (o.FirstName?.toLowerCase().includes(search) || o.LastName?.toLowerCase().includes(search)) {
                  match = true;
                  throw BreakError;
                }
                break;

              default:
                if (o[column]?.toString().toLowerCase().includes(search)) {
                  match = true;
                  throw BreakError;
                }
                break;
            }
          });
        } catch (e) {
          if (e !== BreakError) throw e;
        };

        return match;
      }

      return true;
    });
  }

  canUpload(orderUpload: OrderUploadEx): boolean {
    if (!orderUpload) {
      return false;
    }

    if (orderUpload.Collections?.length == 0) {
      return false;
    }

    var emptyCollection = orderUpload.Collections.find(c => this.photoCount.transform(orderUpload, c) == 0);
    if (emptyCollection) {
      return false;
    }

    return true;
  }

  copyClaimCode(orderUpload: OrderUpload): void {
    const url = this.getClaimCodeUrl(orderUpload);
    if (url) {
      (window as any).ipcRenderer.send('app:copyToClipboard', url);
    }
  }

  createOrderUpload(orderUpload: OrderUpload): Observable<OrderUpload> {
    return this.$http.post<OrderUpload>(this.baseUrl, orderUpload);
  }

  deleteOrderUpload(orderUpload: OrderUpload): Observable<void> {
    return this.$http.delete<void>(`${this.baseUrl}/${orderUpload.Id}`);
  }

  @CacheObservable()
  getOrderUpload(idOrderUpload: string): Observable<OrderUpload[]> {
    return this.$http.get<OrderUpload[]>(`${this.baseUrl}/${idOrderUpload}`);
  }

  @CacheObservable()
  getOrderUploadByToken(token: string): Observable<OrderUpload[]> {
    return this.$http.get<OrderUpload[]>(`${this.baseUrl}/${token}?bytoken=true`);
  }

  markOrderUploadComplete(orderUpload: OrderUpload): Observable<OrderUpload> {
    return this.$http.post<OrderUpload>(`${this.baseUrl}/${orderUpload.Id}/complete`, null);
  }

  openClaimCode(orderUpload: OrderUpload): void {
    const url = this.getClaimCodeUrl(orderUpload);
    if (url) {
      (window as any).ipcRenderer.send('app:openExternal', url);
    }
  }

  openOrderNumber(orderUpload: OrderUpload): void {
    if (orderUpload.idOrder) {
      let url = `https://mylab.photofinale.com/Orders/Details/${orderUpload.idOrder}`;
      (window as any).ipcRenderer.send('app:openExternal', url);
    }
  }

  processOrderUpload(orderUpload: OrderUpload): Observable<OrderUpload> {
    this.busyService.add({ key: `process-order-upload-${orderUpload.Id}` });
    return this.$http.post<OrderUpload>(`${this.baseUrl}/${orderUpload.Id}/process`, null).pipe(
      finalize(() => this.busyService.remove({ key: `process-order-upload-${orderUpload.Id}` }))
    );
  }

  refreshData(): void {
    this.start();
    this.refreshing$$.next(true);
  }

  sendOrderUploadEmail(orderUpload: OrderUpload): Observable<void> {
    return this.$http.post<void>(`${this.baseUrl}/${orderUpload.Id}/email`, null);
  }

  start() {
    this.refresh$$.next();
  }

  updateOrderUpload(orderUpload: OrderUpload): Observable<OrderUpload> {
    return this.$http.put<OrderUpload>(`${this.baseUrl}/${orderUpload.Id}`, orderUpload);
  }

  updateSearch(search: string) {
    this.search$$.next(search);
  }

  private getClaimCodeUrl(orderUpload: OrderUpload): string {
    if ($pf.domain && orderUpload.ClaimCode) {
      let url = `${$pf.domain}/digitaluploads/${orderUpload.ClaimCode}`;
      return url;
    }
    return "";
  }
}
