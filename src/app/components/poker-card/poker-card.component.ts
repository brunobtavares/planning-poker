import { Component, Input, OnInit } from '@angular/core';

interface ICard {
  value?: string;
  cardType?: string;
}

@Component({
  selector: 'app-poker-card',
  templateUrl: './poker-card.component.html',
  styleUrls: ['./poker-card.component.scss']
})
export class PokerCardComponent implements OnInit {

  cardTypes: string[] = ['club', 'diamond', 'heart', 'spade'];
  randomCardTypes: string[] = [];
  cardSelected: ICard = {};

  @Input() cardValues = [
    '0',
    '½',
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


  constructor() { }

  ngOnInit() {
    this.generateRandomCardTypes();
  }

  generateRandomCardTypes() {
    this.cardValues.forEach(v => {
      let randomPos = Math.floor(Math.random() * this.cardTypes.length);
      this.randomCardTypes.push(this.cardTypes[randomPos]);
    });
    console.log(this.randomCardTypes);
  }

  onCardSelect(event: any) {
    if (event == this.cardSelected.value) {
      this.cardSelected = {};
      console.log(this.cardSelected, 1);
      return;
    }

    this.cardSelected = {
      value: event
    }
    console.log(this.cardSelected, 2);
  }

}
