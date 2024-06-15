import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor() { }

  private popUpSubject = new Subject<string>();
  popupState$ = this.popUpSubject.asObservable();

  showPopUp(message: string): void {
    this.popUpSubject.next(message);
  }
}
