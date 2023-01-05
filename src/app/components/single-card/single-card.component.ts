import { FirestoreService } from 'src/app/services/firestore-service.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { IUser } from './../../interfaces/IUser';
import { stateType } from 'src/app/reducer/session/session.actions';
import { Store } from '@ngrx/store';
@Component({
  selector: 'single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.scss']
})
export class SingleCardComponent implements OnInit, OnDestroy {

  @Input() enableRemoveUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() revealCardEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() user: IUser = { name: '', selectedCard: '', isSpectator: true };

  revealCard: boolean = false;
  canRemoveUser: boolean = false;

  session: stateType = {};

  constructor(
    private firestoreService: FirestoreService,
    private store: Store<{ session: stateType }>
  ) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
    this.revealCardEvent.subscribe(event => this.revealCard = event);
    this.enableRemoveUser.subscribe(event => this.canRemoveUser = event);
  }

  ngOnDestroy() { }

  removeUser() {
    var dialogResult = confirm(`Deseja remover o usuário ${this.user.name}?`);

    if (dialogResult && this.session.room?.name) {
      this.firestoreService.removeUserAsync(this.session.room.name, this.user.name);
    }
  }
}
