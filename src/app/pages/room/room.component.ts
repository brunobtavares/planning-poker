import { setRoom } from './../../reducer/session/session.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Subscription } from 'rxjs';
import { stateType } from 'src/app/reducer/session/session.actions';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { IUser } from './../../interfaces/IUser';
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

  roomChanges: Subscription = new Subscription();

  loading: boolean = true;
  roomName: string = '';
  user?: IUser;
  users: IUser[] = [];
  spactatorCount: Number = 0;
  playerCount: Number = 0;

  revealCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  enableRemoveUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  reveal: boolean = false;
  average: number = 0;


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

    // store.select((store) => store.session).subscribe((response) => this.session = response);
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
    this.user = this.locaStorageService.get('session-key') as IUser;

    if (room == null || !this.user.name) {
      this.router.navigate(['/']);
      return;
    }
    else if (room.users.findIndex(u => u.name == this.user?.name) < 0) {
      await this.firestoreService.AddUserAsync(this.roomName, this.user);
    }

    this.revealCard.subscribe(event => { this.reveal = event; });

    this.roomChanges = this.firestoreService.listenRoomChanges(this.roomName)
      .subscribe({
        next: (room) => {
          this.store.dispatch(setRoom({ room }));

          //Check if user was removed
          if (room.users.findIndex(u => u.name == this.user?.name) < 0) {
            alert('Você foi removido da sala');
            this.router.navigate(['/']);
            return;
          }

          this.users = this.users.filter(u => room.users.map(u => u.name).includes(u.name));

          for (const user of room.users) {
            if (user.name != this.user?.name) {
              let userFound = this.users.find(u => u.name == user.name);

              if (userFound) {
                userFound = { ...userFound, selectedCard: user.selectedCard };
              } else {
                this.users.push(user);
              }
            }
          }

          let sum = 0;
          let userAvaliableCount = 0;
          room.users.forEach(user => {
            if (!user.isSpectator && !isNaN(Number(user.selectedCard))) {
              sum += Number(user.selectedCard)
              userAvaliableCount++;
            }
          });
          this.average = Math.trunc(sum / userAvaliableCount);

          this.spactatorCount = room.users.filter(u => u.isSpectator).length;
          this.playerCount = room.users.filter(u => !u.isSpectator).length;

          this.revealCard.emit(room.revealCards);
        }
      });

    this.loading = false;
  }

  async handleUserExiting() {
    this.roomChanges.unsubscribe();
    await this.firestoreService.removeUserAsync(this.roomName, this.user!.name);
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
  }

  filterSpactators() {
    return this.users.filter(u => u.isSpectator);
  }

  alterName() {
    var inputText = document.getElementById('newName') as HTMLInputElement;

    if (inputText.value) {
      if (this.users.findIndex(u => u.name == inputText.value) < 0) {
        let user = this.locaStorageService.get('session-key') as IUser;
        user.name = inputText.value.substring(0, 25);

        this.locaStorageService.set('session-key', user);
        this.user = user;

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
