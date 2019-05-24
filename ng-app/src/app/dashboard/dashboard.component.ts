import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective } from '@angular/forms';

import { OptionsService } from '../services/options.service';
import { ApiService } from '../services/api.service';

import { Product } from '../models/product';
import { ProductResults } from '../models/product-results';

/*
  Things to do:
  - Create a docker environment for you to run everything in one step
 */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(FormGroupDirective) productFormGroupDirective;
  productForm: FormGroup;
  productResults: ProductResults;
  product: Product;
  products = new Map();

  constructor(private formBuilder: FormBuilder, private optionsService: OptionsService, private apiService: ApiService) { }

  ngOnInit() {
    this.productForm = this.createForm();
    this.setSavedProducts();
    this.getEmail();
  }

  createForm(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.email]),
      size: new FormControl({ value: '' }, [Validators.required]),
      url: new FormControl('', [Validators.required])
    });
  }

  getEmail(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.productForm.get('email').setValue(localStorage.getItem('email'));
    }
  }

  getSizeOptions(): Array<object> {
    return this.optionsService.getSpecificOptions('SIZES');
  }

  private setEmail(): void {
    const email = this.productForm.get('email').value;
    if (email) {
      localStorage.setItem('email', email);
    }
  }

  setSavedProducts(): void {
    const products = new Map(JSON.parse(localStorage.getItem('products')));
    if (products.size) {
      this.products = products;
    }
  }

  private updateSavedProducts(product): void {
    this.products.set(this.apiService.buildProductId(product), product);
    localStorage.setItem('products', JSON.stringify(Array.from(this.products.entries())));
  }

  private removeSavedProducts(product): void {
    this.products.delete(this.apiService.buildProductId(product));
    localStorage.setItem('products', JSON.stringify(Array.from(this.products.entries())));
  }

  private clearForm(): void {
    this.productFormGroupDirective.resetForm();
    this.getEmail();
  }

  onSubmit(): void {
    this.products.set(this.apiService.buildProductId(this.productForm.value), this.productForm.value);
    this.setEmail();
    this.clearForm();
  }
}
