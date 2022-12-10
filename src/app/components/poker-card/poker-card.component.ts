import { Component, Input, OnInit } from '@angular/core';
import { ICard } from 'src/app/interfaces/ICard';
import { FirestoreService } from 'src/app/services/firestore-service.service';
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
    // '½',
    '1',
    '2',
    '3',
    '5',
    '8',
    '9',
    '20',
    '40',
    '100'
  ];

  @Input() roomName?: string;
  @Input() user?: IUser;

  constructor(
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() { }

  onCardSelect(event: any) {
    if (event == this.cardSelected.value) {
      this.cardSelected = {};
      return;
    }

    this.cardSelected = { value: event };

    this.user!.selectedCard = event;
    this.firestoreService.updateUserAsync(this.roomName!, this.user!);
  }

}
