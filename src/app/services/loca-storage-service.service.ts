import { Injectable } from '@angular/core';

type keys = 'user-data';

@Injectable({
  providedIn: 'root'
})
export class LocaStorageService {

  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  set(key: keys, value: any): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  get(key: keys): any {
    if (this.storage) {
      let item = this.storage.getItem(key) || JSON.stringify({});
      return JSON.parse(item);
    }
    return null;
  }

  remove(key: keys): boolean {
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
