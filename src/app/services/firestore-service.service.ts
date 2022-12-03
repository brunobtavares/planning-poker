import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { IRoom } from './../interfaces/IRoom';

@Injectable({
  providedIn: 'root'
})
export class FirestoreServiceService {

  private mainCollectionName = 'rooms';

  constructor(
    private firestore: AngularFirestore
  ) { }

  newRoom(data: IRoom) {
    this.firestore.collection(this.mainCollectionName).doc().set(data);
  }

  getRoom(roomName: string): Observable<IRoom> {
    return this.firestore.collection(this.mainCollectionName, ref => ref.where('name', '==', roomName))
      .valueChanges()
      .pipe(map((val: any) => val.length > 0 ? val[0] : null));
  }
}
