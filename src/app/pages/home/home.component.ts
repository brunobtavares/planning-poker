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
  rooms: string[] = [];
  roomsSubscription: Subscription = new Subscription();

  session: stateType = { theme: 'light' };

  constructor(
    private router: Router,
    private localStorage: LocaStorageService,
    private firestoreService: FirestoreService,
    private store: Store<{ session: stateType }>
  ) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
    this.roomsSubscription = this.firestoreService.getAllRooms().subscribe((data) => this.rooms = data.map(d => d.name));
    const user = this.localStorage.get('session-key');
    setTimeout(() => this.store.dispatch(setUser({ user })), 0);
  }

  ngOnDestroy() {
    this.roomsSubscription.unsubscribe();
  }

  createNewRoom() {
    let roomNameInput = (document.getElementById('new-room') as HTMLInputElement);

    if (this.rooms.includes(roomNameInput.value.toLowerCase())) {
      let dialogResult = confirm(`Uma sala com o nome ${roomNameInput.value}, já existe. Deseja ser redirecionado?`);

      if (dialogResult) {
        this.router.navigate([`room/${roomNameInput}`]);
      }
    }
    else {
      this.firestoreService.newRoom({
        name: roomNameInput.value,
        revealCards: false,
        calc: 0,
        users: []
      })
    }

    roomNameInput.value = '';
  }

  saveUserName() {
    let userName: string = (document.getElementById('user-name') as any).value;

    this.firestoreService.userExists(userName)
      .subscribe(exists => {
        if (exists) {
          alert('Nome de usuário já cadastrado, escolha outro!');
          return;
        };

        const user = {
          name: userName,
          selectedCard: '',
          isSpectator: true
        }

        this.store.dispatch(setUser({ user: user }));
      });
  }

  enterRoom(roomName: string, isSpectator: boolean) {

    const user: IUser = {
      ...this.session.user!,
      isSpectator
    }

    this.store.dispatch(setUser({ user }));

    this.router.navigate([`room/${roomName}`]);
  }
}
