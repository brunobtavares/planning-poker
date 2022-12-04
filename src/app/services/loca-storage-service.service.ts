import { ILocalStorage } from './../interfaces/ILocalStorage';
import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaStorageService {

  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  set(key: string, value: any): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  get(key: string): any {
    if (this.storage) {
      let item = this.storage.getItem(key) || JSON.stringify({} as ILocalStorage);
      return JSON.parse(item);
    }
    return null;
  }

  remove(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }
}
