import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Subscription } from 'rxjs';
import { stateType } from 'src/app/reducer/session/session.actions';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { IUser } from './../../interfaces/IUser';
import { setRoom, setUser } from './../../reducer/session/session.actions';
import { LocaStorageService } from './../../services/loca-storage-service.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  animations: [
    trigger('Fading', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('800ms ease-out')),
      transition(':leave', animate('800ms ease-in')),
    ])
  ]
})
export class RoomComponent implements OnInit, OnDestroy {

  enableRemoveUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  revealCardEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  roomSubscription: Subscription = new Subscription();

  loading: boolean = true;
  roomName: string = '';
  users: IUser[] = [];
  spactatorCount: Number = 0;
  playerCount: Number = 0;
  reveal: boolean = false;
  average: number = 0;
  session: stateType = {};

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private locaStorageService: LocaStorageService,
    private hotkeysService: HotkeysService,
    private store: Store<{ session: stateType }>
  ) {
    this.hotkeysService.add(new Hotkey('alt+shift+k', (event: KeyboardEvent): boolean => {
      this.enableRemoveUser.emit(true);
      return false;
    }));

    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
    this.roomName = this.activatedroute.snapshot.paramMap.get("roomName")!;
    this.checkIfRoomExists();
  }

  ngOnDestroy() {
    this.handleUserExiting();
  }

  async checkIfRoomExists() {
    let room = await this.firestoreService.getRoomAsync(this.roomName);

    this.store.dispatch(setUser({ user: this.locaStorageService.get('session-key') }));
    this.store.dispatch(setRoom({ room }));

    if (room == null || !this.session.user) {
      this.router.navigate(['/']);
      return;
    }
    else if (room.users.findIndex(u => u.name == this.session.user?.name) < 0) {
      await this.firestoreService.AddUserAsync(this.roomName, this.session.user);
    }

    this.revealCardEvent.subscribe(event => this.reveal = event);

    this.roomSubscription = this.firestoreService.listenRoomChanges(this.roomName)
      .subscribe({
        next: (room) => {
          this.store.dispatch(setRoom({ room }));

          //Check if user was removed
          const isUserInRoom = room.users.findIndex(remoteUser => remoteUser.name == this.session.user?.name);
          if (isUserInRoom < 0) {
            alert('Você foi removido da sala');
            this.router.navigate(['/']);
            return;
          }

          //Remove user if it's not in room
          const remoteUserNames = room.users.map(u => u.name);
          this.users = this.users.filter(u => remoteUserNames.includes(u.name));

          let sum = 0;
          let userAvaliableCount = 0;
          for (const remoteUser of room.users) {
            if (remoteUser.name != this.session.user?.name) {

              let userIdx = this.users.findIndex(u => u.name == remoteUser.name);

              if (userIdx < 0) {
                this.users.push(remoteUser);
              }
              else {
                this.users[userIdx] = remoteUser;
              }
            }

            if (!remoteUser.isSpectator && !isNaN(Number(remoteUser.selectedCard))) {
              sum += Number(remoteUser.selectedCard)
              userAvaliableCount++;
            }
          }

          this.average = Math.trunc(sum / userAvaliableCount);
          this.spactatorCount = room.users.filter(u => u.isSpectator).length;
          this.playerCount = room.users.filter(u => !u.isSpectator).length;

          this.revealCardEvent.emit(room.revealCards);
        }
      });

    this.loading = false;
  }

  trackUser(index: number, user: IUser) {
    return user.name;
  }

  async handleUserExiting() {
    this.roomSubscription.unsubscribe();
    if (this.session.user?.name)
      await this.firestoreService.removeUserAsync(this.roomName, this.session.user.name);
  }

  revealCards() {
    this.firestoreService.revealCardAsync(this.roomName, true);
  }

  hideCards() {
    this.firestoreService.revealCardAsync(this.roomName, false);
  }

  resetCards() {
    this.firestoreService.resetCardAsync(this.roomName);
  }

  filterPlayers() {
    return this.users.filter(u => !u.isSpectator);
    // return this.session.room?.users.filter(u => !u.isSpectator && u.name != this.session.user?.name) ?? [];
  }

  filterSpactators() {
    return this.users.filter(u => u.isSpectator);
    // return this.session.room?.users.filter(u => u.isSpectator) ?? [];
  }

  alterName() {
    var inputText = document.getElementById('newName') as HTMLInputElement;

    if (inputText.value) {
      if (this.users.findIndex(u => u.name == inputText.value) < 0) {
        let user = this.session.user!;
        user = {
          ...this.session.user!,
          name: inputText.value.substring(0, 25)
        };

        this.store.dispatch(setUser({ user }));

        this.firestoreService.updateUserAsync(this.roomName, user);

        inputText.value = '';
      } else {
        alert('Não foi possível renomear');
      }
    }
  }

  removeUser(userName: string) {
    var dialogResult = confirm(`Deseja remover o usuário ${userName}?`);

    if (dialogResult) {
      this.firestoreService.removeUserAsync(this.roomName, userName);
    }
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
  }
}
