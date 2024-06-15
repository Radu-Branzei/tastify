import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { CommonModule } from '@angular/common';
import { Track } from '../../interfaces/track.interface';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile-page',
  standalone: true,
  templateUrl: './my-profile-page.component.html',
  styleUrl: './my-profile-page.component.scss',
  imports: [TruncatePipe, CommonModule, SongCardComponent]
})
export class MyProfilePageComponent implements OnInit, OnDestroy {

  myData: any;
  playbackState: any;
  currentTrack!: Track | null;
  isConnected: boolean = false;
  isPlaying: boolean | null = null;
  intervalId: any;
  currentUser!: User | null;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    const storedData = localStorage.getItem('userData');
    const userData = JSON.parse(storedData!);
    this.myData = userData;

    this.currentUser = await this.userService.getUserById(this.myData.id);

    this.checkSpotifyConnection();
    this.intervalId = setInterval(() => {
      this.checkSpotifyConnection();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async checkSpotifyConnection(): Promise<void> {
    this.isConnected = await this.isConnectedToSpotify();
    if (this.isConnected) {
      this.currentTrack = await this.userService.getCurrentlyPlayingTrack();

      if (this.isPlaying == null || true) {
        if (this.playbackState.is_playing == true) {
          this.isPlaying = true;
        }
        else {
          this.isPlaying = false;
        }
        console.log(this.currentTrack);
      }
    }
  }

  async isConnectedToSpotify(): Promise<boolean> {
    try {
      this.playbackState = await this.userService.getPlaybackState();
      return this.playbackState != null;
    } catch (error) {
      console.error('Error checking Spotify connection:', error);
      return false;
    }
  }

  playPreviousTrack(): void {
    this.userService.skipToPrevious();
  }

  playNextTrack(): void {
    this.userService.skipToNext();
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.userService.resumePlayer();
    } else {
      this.userService.pausePlayer();
    }
  }

  redirectToSpotifyPage(): void {
    window.open(this.myData.external_urls.spotify, '_blank');
  }

  redirectToListeningInfoPage(): void {
    this.router.navigate(['/listening-info']);
  }

  redirectToObscurityPage(): void {
    this.router.navigate(['/obscurity']);
  }

  redirectToRecommendationsPage(): void {
    this.router.navigate(['/recommendations']);
  }
}
