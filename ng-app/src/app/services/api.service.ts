import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, timer } from 'rxjs';
import { filter, take, flatMap, finalize } from 'rxjs/operators';

import { ProductResults } from '../models/product-results';

import * as config from '../../assets/config.json';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  config;
  pollingItems = new Map();
  audio = new Audio();

  constructor(private http: HttpClient) { }

  buildProductId(product): string {
    return `${product.url}${product.size}`;
  }

  playNotification(): void {
    this.audio.src = '/assets/slow-spring-board-longer-tail.mp3';
    this.audio.load();
    this.audio.loop = true;
    this.audio.play();
  }

  stopNotification(): void {
    this.audio.pause();
  }

  getProductResults(product): Observable<any> {
    const httpObservable = this.http.post<ProductResults>(`${config.apiUrl}${config.productUrl}`, product, httpOptions);

    return httpObservable;
  }

  registerPoll(product): Observable<any> {
    const PRODUCT_ID = this.buildProductId(product);
    const PRODUCT = {
      url: product.url,
      size: product.size,
      email: product.email
    };
    const HAS_EXISTING_PRODUCT = this.pollingItems.has(PRODUCT_ID);

    let pollingItem$ = null;

    if (HAS_EXISTING_PRODUCT) {
      return this.pollingItems.get(PRODUCT_ID);
    } else {
      this.pollingItems.set(PRODUCT_ID, timer(0, config.pollingProductsInterval).pipe(
        flatMap(() => this.http.post<ProductResults>(`${config.apiUrl}${config.productUrl}`, PRODUCT, httpOptions)),
        filter(data => data.available === true),
        take(1),
        finalize(() => this.unregisterPoll(PRODUCT_ID))
      ));
    }

    pollingItem$ = this.pollingItems.get(PRODUCT_ID);

    return pollingItem$;
  }

  unregisterPoll(PRODUCT_ID): void {
    if (this.pollingItems.has(PRODUCT_ID)) {
      this.pollingItems.delete(PRODUCT_ID);
    }
  }
}
