import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { IRoom } from './../interfaces/IRoom';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private mainCollectionName = 'rooms';

  constructor(
    private firestore: AngularFirestore
  ) { }

  newRoom(data: IRoom) {
    data.name = data.name.toLocaleLowerCase();
    this.firestore.collection(this.mainCollectionName).doc().set(data);
  }

  async getRoomAsync(roomName: string): Promise<IRoom> {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName, ref => ref.where('name', '==', roomName))
      .valueChanges()
      .pipe(map((val: any) => val.length > 0 ? val[0] : null));

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
            console.log(user);
            if (!result) result = user.name == userName;
          });
        });

        return result;
      }));
  }

  async updateUserAsync(roomName: string, data: IUser): Promise<boolean> {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName)
      .get()
      .pipe(map((snapShot) => {
        let docs = snapShot.docs;
        let result: boolean = false;

        docs.forEach(async doc => {
          let roomId = doc.id;
          let room = doc.data();

          if (roomName == room.name) {
            let userIdx = room.users.findIndex(u => u.name == data.name);
            room.users.splice(userIdx, 1);
            room.users.push(data);

            await this.updateRoomByIdAsync(roomId, room);

            result = true;
          }
        });

        return result;
      }));

    return await firstValueFrom(response);
  }

  async removeUserAsync(roomName: string, userName: string): Promise<boolean> {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName)
      .get()
      .pipe(map((snapShot) => {
        let docs = snapShot.docs;
        let result: boolean = false;

        docs.forEach(async doc => {
          let roomId = doc.id;
          let room = doc.data();

          if (roomName == room.name) {
            let userIdx = room.users.findIndex(u => u.name == userName);
            room.users.splice(userIdx, 1);

            await this.updateRoomByIdAsync(roomId, room);

            result = true;
          }
        });

        return result;
      }));

    return await firstValueFrom(response);
  }

  async AddUserAsync(roomName: string, user: IUser): Promise<boolean> {
    let response = this.firestore.collection<IRoom>(this.mainCollectionName)
      .get()
      .pipe(map((snapShot) => {
        let docs = snapShot.docs;
        let result: boolean = false;

        docs.forEach(async doc => {
          let roomId = doc.id;
          let room = doc.data();

          if (roomName == room.name) {
            let userIdx = room.users.findIndex(u => u.name == user.name);

            if (userIdx >= 0) {
              room.users.splice(userIdx, 1);
            }

            room.users.push(user);
            await this.updateRoomByIdAsync(roomId, room);

            result = true;
          }
        });
        return result;
      }));

    return await firstValueFrom(response);
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

  getAllRooms(): Observable<IRoom[]> {
    return this.firestore.collection<IRoom>(this.mainCollectionName).valueChanges();
  }

  listenRoomChanges(roomName: string): Observable<IRoom> {
    return this.firestore.collection<IRoom>(this.mainCollectionName)
      .valueChanges()
      .pipe(map((rooms) => {
        for (const room of rooms) {
          if (room.name == roomName)
            return room;
        }
        return {} as IRoom;
      }));
  }
}
