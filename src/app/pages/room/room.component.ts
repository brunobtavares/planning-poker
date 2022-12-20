import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  reveal: boolean = false;
  average: number = 0;


  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private locaStorageService: LocaStorageService
  ) { }

  ngOnInit() {
    this.roomName = this.activatedroute.snapshot.paramMap.get("roomName")!;
    this.checkIfRoomExists();
  }

  ngOnDestroy() {
    this.handleUserExiting();
  }

  async checkIfRoomExists() {
    let room = await this.firestoreService.getRoomAsync(this.roomName);
    this.user = this.locaStorageService.get('user-data') as IUser;

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

          for (const user of room.users) {

            if (room.users.length - 1 < this.users.length) {
              this.users = this.users.filter(u => room.users.map(u => u.name).includes(u.name));
            }

            if (user.name != this.user?.name) {
              let userFound = this.users.find(u => u.name == user.name);

              if (userFound) {
                userFound.selectedCard = user.selectedCard;
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
    let user = this.locaStorageService.get('user-data') as IUser;
    this.roomChanges.unsubscribe();
    await this.firestoreService.removeUserAsync(this.roomName, user.name);
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

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    alert('Vai sair');
  }
}
