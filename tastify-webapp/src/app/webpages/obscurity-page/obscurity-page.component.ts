import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription, interval } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { CommonModule } from '@angular/common';
import { Track } from '../../interfaces/track.interface';
import { fadeIn, fadeInSlow } from '../../interfaces/animations';
import { UserCardComponent } from "../../profiles/user-card/user-card.component";
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-obscurity-page',
  standalone: true,
  templateUrl: './obscurity-page.component.html',
  styleUrl: './obscurity-page.component.scss',
  animations: [
    fadeInSlow
  ],
  imports: [SongCardComponent, CommonModule, UserCardComponent]
})
export class ObscurityPageComponent implements OnInit {

  @ViewChild('obscurityScoreElement') obscurityScoreElement!: ElementRef;

  currentObscurityScore: number = 0.0;
  obscurityScore: number = -1.0;
  animationDuration = 2000;
  animationSubscription!: Subscription;
  averageObscurityScore!: number;
  mostPopularTracks!: Track[] | null;
  mostUniqueTracks!: Track[] | null;
  similarUsers!: User[] | null;

  constructor(private userService: UserService, private authService: AuthService, private renderer: Renderer2) { }

  async ngOnInit(): Promise<void> {

    this.obscurityScore = await this.userService.calculateObscurityScore();
    if (this.obscurityScore > 0) {
      this.obscurityScore = 100 - this.obscurityScore;
      await this.authService.updateObscurityScore(this.obscurityScore);
      await this.updateObscurityInfo();
      await this.animateNumberIncrease();
    }
  }

  isValueNaN(value: number) {
    if (isNaN(value)) {
      return true;
    }
    else {
      return false;
    }
  }

  async updateObscurityInfo(): Promise<void> {
    await this.authService.updateAverageObscurityScore();
    this.averageObscurityScore = await this.authService.getAverageObscurityScore();
    let tracks = await this.userService.getUsersTopTracks(1);
    tracks!.sort((a, b) => b.popularityScore - a.popularityScore);

    this.mostPopularTracks = tracks!.slice(0, 3);
    this.mostUniqueTracks = tracks!.slice(-3).reverse();
    this.similarUsers = await this.userService.getSimilarUsers(this.obscurityScore);
  }

  async animateNumberIncrease(): Promise<void> {
    const steps = 100;
    const intervalTime = this.animationDuration / steps;
    const increment = (this.obscurityScore - this.currentObscurityScore) / steps;

    this.animationSubscription = interval(intervalTime).subscribe(() => {
      this.currentObscurityScore += increment;
      const formattedScore = this.currentObscurityScore.toFixed(2);
      this.renderer.setProperty(this.obscurityScoreElement.nativeElement, 'textContent', formattedScore);

      if (this.currentObscurityScore >= this.obscurityScore) {
        this.animationSubscription.unsubscribe();
      }
    });
  }

  getObscurityLevelMessage(obscurityScore: number): string {
    switch (true) {
      case obscurityScore >= 0 && obscurityScore <= 20:
        return "Do you listen to anything outside radio pop songs?";
      case obscurityScore > 20 && obscurityScore <= 40:
        return "You seem to be listening to what everybody else is.";
      case obscurityScore > 40 && obscurityScore <= 60:
        return "Very balanced, as all things should be.";
      case obscurityScore > 60 && obscurityScore <= 80:
        return "We get it. You don't like being mainstream.";
      case obscurityScore > 80 && obscurityScore <= 100:
        return "You definitely like to boast about how hipster you are.";
      default:
        return "Out of Range";
    }
  }
}
