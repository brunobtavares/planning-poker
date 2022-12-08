import { IUser } from './../../interfaces/IUser';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { LocaStorageService } from 'src/app/services/loca-storage-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  userData?: IUser;
  rooms: string[] = [];
  getAllRooms: Subscription = new Subscription();

  constructor(
    private router: Router,
    private localStorage: LocaStorageService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.getAllRooms = this.firestoreService.getAllRooms().subscribe((data) => this.rooms = data.map(d => d.name));
    this.userData = this.localStorage.get('user-data');
  }

  ngOnDestroy() {
    this.getAllRooms.unsubscribe();
  }

  createNewRoom() {
    let roomName: string = (document.getElementById('new-room') as any).value;

    if (this.rooms.includes(roomName.toLowerCase())) {
      let dialogResult = confirm(`Uma sala com o nome ${roomName}, já existe. Deseja ser redirecionado?`);

      if (dialogResult) {
        this.router.navigate([`room/${roomName}`]);
      }
    }
    else {

      let userData = this.localStorage.get('user-data') as IUser;

      this.firestoreService.newRoom({
        name: roomName,
        revealCards: false,
        calc: 0,
        users: [
          {
            name: userData.name || '',
            selectedCard: '0'
          }
        ]
      })
    }
  }

  saveUserName() {
    let userName: string = (document.getElementById('user-name') as any).value;

    this.firestoreService.userExists(userName)
      .subscribe(exists => {
        if (exists) {
          alert('Nome de usuário já cadastrado, escolha outro!');
          return;
        };

        this.userData = {
          name: userName,
          selectedCard: '0'
        }
        this.localStorage.set('user-data', this.userData);
      });
  }
}
