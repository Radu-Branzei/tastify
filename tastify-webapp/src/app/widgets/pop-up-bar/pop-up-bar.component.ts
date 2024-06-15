import { Component, Input, OnInit } from '@angular/core';
import { PopUpService } from '../../services/pop-up.service';

@Component({
  selector: 'app-pop-up-bar',
  templateUrl: './pop-up-bar.component.html',
  styleUrl: './pop-up-bar.component.scss'
})
export class PopUpBarComponent implements OnInit {

  message: string = '';
  isVisible: boolean = false;

  constructor(private popupService: PopUpService) { }

  ngOnInit(): void {
    this.popupService.popupState$.subscribe(message => {
      this.message = message;
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    });
  }

  closePopup(): void {
    this.isVisible = false;
  }
}