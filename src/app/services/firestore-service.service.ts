import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { stateType } from '../reducer/session/session.actions';
import { IRoom } from './../interfaces/IRoom';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private mainCollectionName = 'rooms';

  session: stateType = {};

  constructor(
    private firestore: AngularFirestore,
    private store: Store<{ session: stateType }>
  ) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  newRoom(data: IRoom) {
    data.name = data.name.toLocaleLowerCase();
    this.firestore.collection(this.mainCollectionName).doc(data.name).set(data);
  }

  async getRoomAsync(roomName: string): Promise<IRoom> {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName).doc(roomName)
      .get()
      .pipe(map((room) => room.data() ?? {} as IRoom));

    return await firstValueFrom(response);
  }

  userExists(userName: string): Observable<boolean> {
    return this.firestore.collection<IRoom>(this.mainCollectionName)
      .get()
      .pipe(map((snapShot) => {
        let docs = snapShot.docs;
        let result: boolean = false;

        docs.forEach(doc => {
          let room = doc.data();
          room.users.forEach(user => {
            if (!result) result = user.name == userName;
          });
        });

        return result;
      }));
  }

  async updateUserAsync(roomName: string, data: IUser): Promise<boolean> {
    var room = await this.getRoomAsync(roomName);

    let userIdx = room.users?.findIndex(user => user.name == data.name);

    if (userIdx >= 0) {
      room.users[userIdx] = { ...data };
      await this.updateRoomByIdAsync(roomName, room);

      return true;
    }

    return false;
  }

  async updateUserNameAsync(roomName: string, lastName: string, data: IUser): Promise<boolean> {
    var room = await this.getRoomAsync(roomName);

    let userIdx = room.users?.findIndex(user => user.name == lastName);
    
    if (userIdx >= 0) {
      room.users[userIdx] = { ...data };
      await this.updateRoomByIdAsync(roomName, room);

      return true;
    }

    return false;
  }

  async removeUserAsync(roomName: string, userName: string): Promise<boolean> {
    const response = this.firestore.collection<IRoom>(this.mainCollectionName).doc(roomName);
    const docs = await firstValueFrom(response.get());
    var room = docs.data();

    if (room) {
      let userIdx = room.users.findIndex(user => user.name == userName);
      room.users.splice(userIdx, 1);

      await this.updateRoomByIdAsync(roomName, room);

      return true;
    }

    return false;
  }

  async AddUserAsync(roomName: string, user: IUser): Promise<boolean> {
    var room = await this.getRoomAsync(roomName);

    let userIdx = room.users.findIndex(u => u.name == user.name);

    if (userIdx < 0) {
      room.users.push(user);
      await this.updateRoomByIdAsync(roomName, room);

      return true;
    }

    return false;
  }

  private async updateRoomByIdAsync(roomId: string, data: IRoom) {
    return await this.firestore.collection<IRoom>(this.mainCollectionName).doc(roomId).update(data);
  }

  async revealCardAsync(roomName: string, reveal: boolean) {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName)
      .get()
      .pipe(map((snapShot) => {
        let docs = snapShot.docs;
        let result: boolean = false;

        docs.forEach(async doc => {
          let roomId = doc.id;
          let room = doc.data();

          if (roomName == room.name) {
            room.revealCards = reveal;
            await this.updateRoomByIdAsync(roomId, room);
            result = true;
          }
        });
        return result;
      }));

    return await firstValueFrom(response);
  }

  async resetCardAsync(roomName: string) {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName)
      .get()
      .pipe(map((snapShot) => {
        let docs = snapShot.docs;
        let result: boolean = false;

        docs.forEach(async doc => {
          let roomId = doc.id;
          let room = doc.data();

          if (roomName == room.name) {

            room.revealCards = false;
            room.users.forEach(u => u.selectedCard = "");

            await this.updateRoomByIdAsync(roomId, room);
            result = true;
          }
        });
        return result;
      }));

    return await firstValueFrom(response);
  }

  getAllRooms(): Observable<IRoom[]> {
    return this.firestore.collection<IRoom>(this.mainCollectionName).valueChanges();
  }

  listenRoomChanges(roomName: string): Observable<IRoom> {
    return this.firestore.collection<IRoom>(this.mainCollectionName)
      .doc(roomName)
      .valueChanges()
      .pipe(map((room) => room ?? {} as IRoom));
  }

  // async getRoomAsync(roomName: string): Promise<IRoom> {
  //   let response = this.firestore.collection<IRoom>(this.mainCollectionName, ref => ref.where('name', '==', roomName))
  //     .valueChanges()
  //     .pipe(map((val: any) => val.length > 0 ? val[0] : null));

  //   return await firstValueFrom(response);
  // }
}
