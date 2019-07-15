import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { ApiService } from '../services/api.service';
import { OptionsService } from '../services/options.service';

import { Product } from '../models/product';

import * as config from '../../assets/config.json';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnChanges, OnDestroy {
  @Input() product;
  @Input() products;
  @Output() updateSavedProducts = new EventEmitter<any>();
  @Output() removeSavedProducts = new EventEmitter<any>();

  subscription: Subscription;

  constructor(private apiService: ApiService, private optionsService: OptionsService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    if (!this.product.value.available && !this.product.value.price) {
      this.getProduct(this.product.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.product.currentValue.value.available) {
      this.pingProduct(changes.product.currentValue.value);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  getImgUrlString(imgUrl): string {
    if (imgUrl) {
      return /\'.*\'/.exec(imgUrl)[0].replace(/'/gi, '');
    }
  }

  getProduct(newProduct): void {
    this.apiService.getProductResults(newProduct).subscribe(product => {
      this.snackbar.open(`${product.title} saved successfully!`, 'OK', { duration: config.snackbarDuration });
      this.updateSavedProducts.emit(product);
    }, error => {
      this.snackbar.open(`${error.message}`, 'FAIL', { duration: config.snackbarDuration });
      this.deleteProduct(newProduct);
    });
  }

  pingProduct(newProduct): void {
    if (!this.subscription) {
      this.subscription = this.apiService.registerPoll(newProduct).subscribe(product => {
        this.updateSavedProducts.emit(product);
        if (product.available) {
          const snackbar = this.snackbar.open(`${product.title} is Available!`, 'OK', { });
          this.unregisterPolling(product);
          this.apiService.playNotification();
          snackbar.afterDismissed().subscribe(() => {
            this.apiService.stopNotification();
          });
        }
      });
    }
  }

  unregisterPolling(product): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.apiService.unregisterPoll(product);
    }
  }

  deleteProduct(product): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.products.delete(product.key);
    this.removeSavedProducts.emit(product);
  }

  refreshProduct(product): void {
    const refreshProduct: Product = {
      url: product.value.url,
      size: product.value.size,
      email: localStorage.getItem('email')
    };
    this.getProduct(refreshProduct);
  }
}
