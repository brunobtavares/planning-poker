/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LocaStorageServiceService } from './loca-storage-service.service';

describe('Service: LocaStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocaStorageServiceService]
    });
  });

  it('should ...', inject([LocaStorageServiceService], (service: LocaStorageServiceService) => {
    expect(service).toBeTruthy();
  }));
});
