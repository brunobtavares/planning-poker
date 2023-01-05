import { setUser } from './../../reducer/session/session.actions';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ICard } from 'src/app/interfaces/ICard';
import { stateType } from 'src/app/reducer/session/session.actions';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { LocaStorageService } from 'src/app/services/loca-storage-service.service';
import { IUser } from './../../interfaces/IUser';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.scss']
})
export class PokerCardComponent implements OnInit {

  @Input() revealCard: boolean = false;
  @Input() cardValues = [
    '0',
    '1',
    '2',
    '3',
    '5',
    '8',
    '13',
    '21',
    '34',
    '55'
  ];

  // cardSelected: ICard = {};
  session: stateType = {};

  constructor(
    private firestoreService: FirestoreService,
    private locaStorageService: LocaStorageService,
    private store: Store<{ session: stateType }>
  ) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
  }

  onCardSelect(event: any) {
    let user = this.session.user;

    user = {
      ...this.session.user!,
      selectedCard: event == user?.selectedCard ? '' : event
    };

    this.store.dispatch(setUser({ user: user }));
    this.firestoreService.updateUserAsync(this.session.room?.name!, user!);
  }

}
