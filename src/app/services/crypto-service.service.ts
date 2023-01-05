import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  encryptAES(value: string) {
    return crypto.AES.encrypt(value, environment.encryptKey);
  }

  decryptAES(value: string) {
    const decrypted = crypto.AES.decrypt(value, environment.encryptKey);
    return decrypted.toString(crypto.enc.Utf8);
  }
}
