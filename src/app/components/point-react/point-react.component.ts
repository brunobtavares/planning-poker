import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-point-react',
  templateUrl: './point-react.component.html',
  styleUrls: ['./point-react.component.scss'],
  animations: [
    trigger('Fading', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('300ms ease-out')),
      transition(':leave', animate('300ms ease-in')),
    ])
  ]
})
export class PointReactComponent implements OnInit {

  @Input() value: number = 0;

  constructor() { }

  ngOnInit() {
  }

}
