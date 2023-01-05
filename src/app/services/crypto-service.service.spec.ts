/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CryptoService } from './crypto-service.service';

describe('Service: CryptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoService]
    });
  });

  it('should ...', inject([CryptoService], (service: CryptoService) => {
    expect(service).toBeTruthy();
  }));
});
