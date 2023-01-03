import { FirestoreService } from 'src/app/services/firestore-service.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { IUser } from './../../interfaces/IUser';
@Component({
  selector: 'single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.scss']
})
export class SingleCardComponent implements OnInit, OnDestroy {

  @Input() revealCardEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() enableRemoveUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() roomName: string = '';
  @Input() user: IUser = {
    name: '',
    selectedCard: '',
    isSpectator: true
  };

  revealCard: boolean = false;
  canRemoveUser: boolean = false;

  constructor(
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.revealCardEvent.subscribe(event => this.revealCard = event);
    this.enableRemoveUser.subscribe(event => this.canRemoveUser = event);
  }

  ngOnDestroy() { }

  removeUser() {
    var dialogResult = confirm(`Deseja remover o usuário ${this.user.name}?`);

    if (dialogResult) {
      this.firestoreService.removeUserAsync(this.roomName, this.user.name);
    }
  }
}
