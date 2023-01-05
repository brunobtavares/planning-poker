import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { stateType } from './reducer/session/session.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Planning Poker';

  session: stateType = {
    theme: 'light'
  };

  constructor(private store: Store<{ session: stateType }>) {
    store.select((store) => store.session).subscribe((response) => {
      this.session = response;

      const rootHtml = document.getElementById("rootHtml") as any;
      rootHtml.dataset.bsTheme = response.theme;
    });
  }
}
