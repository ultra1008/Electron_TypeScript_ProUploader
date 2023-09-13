import { $pf } from '../models/PhotoFinaleContext';
import { CacheObservable } from 'pfshared/utility';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

export type ProductTypes = "all" | "apm" | "creative" | "digital-upload" | "media" | "merchandise" | "prints" | "videobook";
export type GetProductParams = { type: string, $skip?: number, $top?: number, $inlinecount?: string };

@Injectable({
  providedIn: 'root'
})
export class DealerProductsService {
  constructor(private $http: HttpClient) { }

  @CacheObservable()
  getProducts(dealerCode: string, type: ProductTypes = "prints", pageNumber?: number, pageSize?: number): Observable<Product[]> {
    const url = `${$pf.apiUrl}/dealers/${dealerCode}/products`;
    let params: GetProductParams = { type };

    if (pageNumber > 0 && pageSize > 0) {
      params = {
        ...params,
        "$skip": (pageNumber - 1) * pageSize,
        "$top": pageSize,
        "$inlinecount": "allpages"
      }
    }

    return this.$http.get<Product[]>(url, { params });
  }
}
