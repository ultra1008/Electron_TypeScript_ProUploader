import { $pf } from '../models/PhotoFinaleContext';
import { CacheObservable } from 'pfshared/utility';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '../models/Store';

@Injectable({
  providedIn: 'root'
})
export class DealerStoresService {
  constructor(private $http: HttpClient) { }

  @CacheObservable()
  getStore(dealerCode: string, storeId: number, params?): Observable<Store> {
    const url = `${$pf.apiUrl}/dealers/${dealerCode}/stores/${storeId}`;

    return this.$http.get<Store>(url, { params });
  }

  @CacheObservable()
  getStores(dealerCode: string, params?): Observable<Store[]> {
    const url = `${$pf.apiUrl}/dealers/${dealerCode}/stores`;

    return this.$http.get<Store[]>(url, { params });
  }

  @CacheObservable()
  getStoresByDealerTags(params?: { tag?: string, start?: string }): Observable<Store[]> {
    const url = `${$pf.apiUrl}/stores/search`;

    return this.$http.get<Store[]>(url, { params });
  }
}
