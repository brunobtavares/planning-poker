import { Component, EventEmitter, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreServiceService } from 'src/app/services/firestore-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  revealCard: EventEmitter<boolean> = new EventEmitter<boolean>();

  items: string[] = []

  dbModelRooms = {
    'room-1': {
      'user-1': 'card-1',
      'user-2': 'card-2',
    }
  }

  constructor(
    private firestoreService: FirestoreServiceService
  ) { }

  ngOnInit() {
    // this.firestore.collection('rooms').valueChanges().subscribe(r => console.log(r));
  }

  addCard() {
    // this.firestore.collection('cards').doc('123').set({ card: 'gravando o primeiro card rs' });
    this.firestoreService.getRoom('Nintendo').subscribe((data) => console.log(data));
    console.log('ok');
  }

  tryEnterRoom() {
    let inputValue = document.getElementById('room-name') as any;
    //inputValue.value;
    // this.firestore.collection(inputValue.value).valueChanges().subscribe(r => console.log(r));
    this.firestoreService.newRoom({
      name: inputValue.value,
      revealCards: false,
      users: [{ name: 'Bruno', selectedCard: '3' }]
    });
  }
}
