import { setUser } from './../../reducer/session/session.actions';
import { IUser } from './../../interfaces/IUser';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { LocaStorageService } from 'src/app/services/loca-storage-service.service';
import { Store } from '@ngrx/store';
import { stateType } from 'src/app/reducer/session/session.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  userData?: IUser = {
    name: 'N/A',
    selectedCard: '',
    isSpectator: false
  };
  rooms: string[] = [];
  getAllRooms: Subscription = new Subscription();

  session: stateType = {
    theme: 'light'
  };

  constructor(
    private router: Router,
    private localStorage: LocaStorageService,
    private firestoreService: FirestoreService,
    private store: Store<{ session: stateType }>
  ) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
    this.getAllRooms = this.firestoreService.getAllRooms().subscribe((data) => this.rooms = data.map(d => d.name));
    this.userData = this.localStorage.get('session-key');
    setTimeout(() => this.store.dispatch(setUser({ user: this.userData })), 0);
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

      let userData = this.localStorage.get('session-key') as IUser;

      this.firestoreService.newRoom({
        name: roomName,
        revealCards: false,
        calc: 0,
        users: [
          {
            name: userData.name || '',
            selectedCard: '',
            isSpectator: true
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
          selectedCard: '',
          isSpectator: true
        }
        this.localStorage.set('session-key', this.userData);
        this.store.dispatch(setUser({ user: this.userData }));
      });
  }

  enterRoom(roomName: string, isSpectator: boolean) {
    this.userData = { ...this.userData!, isSpectator };
    this.localStorage.set('session-key', this.userData);

    this.router.navigate([`room/${roomName}`]);
  }
}
