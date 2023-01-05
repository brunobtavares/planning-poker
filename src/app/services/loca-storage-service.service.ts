import { Injectable } from '@angular/core';
import { CryptoService } from './crypto-service.service';

//type keys = 'user-data';
type keys = 'session-key';

@Injectable({
  providedIn: 'root'
})
export class LocaStorageService {

  private storage: Storage;

  constructor(
    private cryptoService: CryptoService
  ) {
    this.storage = window.localStorage;
  }

  set(key: keys, value: any): boolean {
    if (this.storage) {
      const jsonString = JSON.stringify(value);
      const encrypted = this.cryptoService.encryptAES(jsonString);
      this.storage.setItem(key, encrypted.toString());
      return true;
    }
    return false;
  }

  get(key: keys): any {
    if (this.storage) {
      const valueEncrypted = this.storage.getItem(key);

      if (!valueEncrypted)
        return null;

      const decrypted = this.cryptoService.decryptAES(valueEncrypted);
      return JSON.parse(decrypted);
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
