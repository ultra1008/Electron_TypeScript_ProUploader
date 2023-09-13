import { $pf } from '../models/PhotoFinaleContext';
import { CacheObservable } from 'pfshared/utility';
import { Dealer } from '../models/Dealer';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '../models/Store';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  constructor(private $http: HttpClient) { }

  @CacheObservable()
  getDealer(dealerCode: string): Observable<Dealer> {
    const url = `${$pf.apiUrl}/dealers/${dealerCode}`;

    return this.$http.get<Dealer>(url);
  }

  @CacheObservable()
  getDealerStores(dealerCode: string): Observable<Store[]> {
    const url = `${$pf.apiUrl}/dealers/${dealerCode}/stores`;

    return this.$http.get<Store[]>(url);
  }
}
