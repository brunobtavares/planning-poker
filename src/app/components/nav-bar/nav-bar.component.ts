import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setTheme, stateType } from 'src/app/reducer/session/session.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  session: stateType = {};

  constructor(private store: Store<{ session: stateType }>) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
  }

  changeTheme(theme: 'light' | 'dark') {
    this.store.dispatch(setTheme({ theme: theme }));
  }
}