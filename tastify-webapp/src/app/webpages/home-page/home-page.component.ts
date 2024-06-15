import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ArtistCardComponent } from "../../profiles/artist-card/artist-card.component";
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Artist } from '../../interfaces/artist.interface';
import { Track } from '../../interfaces/track.interface';
import { HeaderMenuComponent } from "../../widgets/header-menu/header-menu.component";
import { PlayerBarComponent } from "../../widgets/player-bar/player-bar.component";
import { fadeIn } from '../../interfaces/animations';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  animations: [
    fadeIn
  ],
  imports: [SongCardComponent, CommonModule, FormsModule, ArtistCardComponent, HeaderMenuComponent, PlayerBarComponent]
})
export class HomePageComponent implements OnInit {

  albums: any;
  userData: any;
  topTracks!: Track[] | null;
  topArtists!: Artist[] | null;
  currentTrack!: Track | null;
  searchInput!: string;
  username!: string;

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.userData = this.authService.getLoggedInUserData();
    this.authService.checkForExistingAccount(this.userData.id);
    this.username = this.userData.display_name;
    this.getPlaybackState();

    console.log(this.authService.isAccessTokenExpired());
  }

  async getPlaybackState(): Promise<void> {
    try {
      this.userService.getPlaybackState();
    } catch (error) {
      console.error('Error during getting your playback state:', error);
    }
  }

  async getCurrentlyPlayingTrack(): Promise<void> {
    try {
      await this.userService.getCurrentlyPlayingTrack();
      this.currentTrack = this.userService.currentlyPlayingTrack;
    } catch (error) {
      console.error('Error during getting your playback state:', error);
    }
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
