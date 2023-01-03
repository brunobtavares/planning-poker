import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ICard } from 'src/app/interfaces/ICard';
import { FirestoreService } from 'src/app/services/firestore-service.service';
import { LocaStorageService } from 'src/app/services/loca-storage-service.service';
import { IUser } from './../../interfaces/IUser';

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.scss']
})
export class PokerCardComponent implements OnInit {

  cardSelected: ICard = {};

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
  @Input() revealCardEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() roomName?: string;
  user?: IUser;
  revealCard: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private locaStorageService: LocaStorageService
  ) { }

  ngOnInit() {
    this.revealCardEvent.subscribe(event => this.revealCard = event);
  }

  onCardSelect(event: any) {
    this.user = this.locaStorageService.get('user-data') as IUser;

    this.cardSelected = {
      value: event == this.cardSelected.value ? '' : event
    };

    this.user!.selectedCard = this.cardSelected.value!;
    this.user!.selectedCard = Number(this.user!.selectedCard) > 55 ? '55' : this.user!.selectedCard;
    this.firestoreService.updateUserAsync(this.roomName!, this.user!);
  }

}
