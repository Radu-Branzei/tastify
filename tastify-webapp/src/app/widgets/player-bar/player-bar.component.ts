import { Component, OnInit } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TruncatePipe } from "../../pipes/truncate.pipe";

@Component({
  selector: 'app-player-bar',
  standalone: true,
  templateUrl: './player-bar.component.html',
  styleUrl: './player-bar.component.scss',
  imports: [CommonModule, TruncatePipe]
})
export class PlayerBarComponent implements OnInit {

  currentTrack!: Track | null;
  playbackState: any;
  isConnected: boolean = false;
  isPlaying: boolean | null = null;
  intervalId: any;
  progressMs!: number;
  totalMs!: number;
  progressBarWidth: number = 0;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.checkSpotifyConnection();
    this.intervalId = setInterval(() => {
      this.checkSpotifyConnection();
      this.updateProgressBar();
    }, 1000);
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

  convertMillisecondsToMinutesAndSeconds(milliseconds: number): string {
    var totalSeconds = Math.floor(milliseconds / 1000);

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

    return minutes + ':' + formattedSeconds;
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

  redirectToTrackPage(trackId: string) {
    this.router.navigate(['/track', trackId]);
  }

  redirectToArtistPage(artistId: string) {
    this.router.navigate(['/artist', artistId]);
  }

  updateProgressBar(): void {
    this.progressMs = this.playbackState.progress_ms;
    this.totalMs = this.playbackState.item.duration_ms;

    this.progressBarWidth = (this.progressMs / this.totalMs) * 100;
  }
}
