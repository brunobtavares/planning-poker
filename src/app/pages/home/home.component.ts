import { ILocalStorage } from './../../interfaces/ILocalStorage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { LocaStorageService } from 'src/app/services/loca-storage-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userData: ILocalStorage = {};
  rooms: string[] = [];

  constructor(
    private router: Router,
    private localStorage: LocaStorageService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.userData = this.localStorage.get('user-data');

    this.firestoreService.getAllRooms()
      .subscribe((data) => {
        this.rooms = data.map(d => d.name);
        console.log(this.rooms);
      });
  }

  createNewRoom() {
    let roomName: string = (document.getElementById('new-room') as any).value;

    if (this.rooms.includes(roomName.toLowerCase())) {
      let dialogResult = confirm(`Uma sala com o nome ${roomName}, já existe. Deseja ser redirecionado?`);

      if (dialogResult) {
        this.router.navigate([`room/${roomName}`]);
      }
    }
  }

  saveUserName() {
    let userName: string = (document.getElementById('user-name') as any).value;

    this.userData.user = {
      name: userName,
      selectedCard: '0'
    }
    this.localStorage.set('user-data', this.userData);
  }
}
