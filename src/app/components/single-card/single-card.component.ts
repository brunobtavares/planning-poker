import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.scss']
})
export class SingleCardComponent implements OnInit {

  @Input() revealCardEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  revealCard: boolean = false;

  constructor() { }

  ngOnInit() {
    this.revealCardEvent.subscribe(e => this.revealCard = e);
  }
}
