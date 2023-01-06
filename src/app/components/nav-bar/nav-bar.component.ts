import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { setTheme, stateType } from 'src/app/reducer/session/session.actions';
import { FirestoreService } from 'src/app/services/firestore-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  session: stateType = {};

  constructor(
    private firestoreService: FirestoreService,
    private store: Store<{ session: stateType }>
  ) {
    store.select((store) => store.session).subscribe((response) => this.session = response);
  }

  ngOnInit() {
  }

  changeTheme(theme: 'light' | 'dark') {
    this.store.dispatch(setTheme({ theme: theme }));
  }

  async exitRoom() {
    var dialogResult = confirm(`Deseja sair da sala?`);

    if (dialogResult && this.session.room?.name && this.session.user?.name) {
      await this.firestoreService.removeUserAsync(this.session.room.name, this.session.user.name);
    }
  }
}