/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirestoreServiceService } from './firestore-service.service';

describe('Service: FirestoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreServiceService]
    });
  });

  it('should ...', inject([FirestoreServiceService], (service: FirestoreServiceService) => {
    expect(service).toBeTruthy();
  }));
});
