import { FirestoreService } from 'src/app/services/firestore-service.service';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  loading: boolean = true;
  roomName: string = '';

  revealCard: EventEmitter<boolean> = new EventEmitter<boolean>();

  //TODO
  items: string[] = []

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    this.roomName = this.activatedroute.snapshot.paramMap.get("roomName")!;
    this.checkIfRoomExists();
  }

  checkIfRoomExists() {
    this.firestoreService.getRoom(this.roomName)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((room) => {
        if (room == null) {
          this.router.navigate(['home']);
        }
      }).unsubscribe();
  }

  addCard() {
    // this.firestore.collection('cards').doc('123').set({ card: 'gravando o primeiro card rs' });
    // this.firestoreService.getRoom('teste').subscribe((data) => console.log(data));
  }

  tryEnterRoom() {
    let inputValue = document.getElementById('room-name') as any;

    this.firestoreService.getRoom('teste')
      .subscribe((data) => {
        if (data == null) {



        }
      });

    this.firestoreService.newRoom({
      name: inputValue.value,
      revealCards: false,
      users: [
        { name: 'Exemplo-1', selectedCard: '3' },
        { name: 'Exemplo-2', selectedCard: '2' }
      ]
    });
  }
}
