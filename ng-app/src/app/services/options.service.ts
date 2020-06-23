import { Injectable } from '@angular/core';

import { Options } from './options';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor() { }

  getSpecificOptions(option) {
    return Options[option];
  }
}
