import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PointReactComponent } from './components/point-react/point-react.component';
import { PokerCardComponent } from './components/poker-card/poker-card.component';
import { SingleCardComponent } from './components/single-card/single-card.component';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading/loading.component';
import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent,
    PokerCardComponent,
    SingleCardComponent,
    LoadingComponent,
    PointReactComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HotkeyModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
