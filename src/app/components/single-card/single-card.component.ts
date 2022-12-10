import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { IUser } from './../../interfaces/IUser';
@Component({
  selector: 'single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.scss']
})
export class SingleCardComponent implements OnInit, OnDestroy {

  @Input() revealCardEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() user: IUser = {
    name: '',
    selectedCard: '0'
  };

  revealCard: boolean = false;

  constructor() { }

  ngOnInit() {
    this.revealCardEvent.subscribe(event => this.revealCard = event);
  }

  ngOnDestroy() { }
}
