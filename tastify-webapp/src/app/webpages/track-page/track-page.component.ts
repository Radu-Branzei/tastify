import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Track } from '../../interfaces/track.interface';
import { ArtistCardComponent } from '../../profiles/artist-card/artist-card.component';
import { CommonModule } from '@angular/common';
import { Artist } from '../../interfaces/artist.interface';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { UserCardComponent } from "../../profiles/user-card/user-card.component";
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-track-page',
  standalone: true,
  templateUrl: './track-page.component.html',
  styleUrl: './track-page.component.scss',
  imports: [CommonModule, ArtistCardComponent, TruncatePipe, UserCardComponent]
})
export class TrackPageComponent implements OnInit {

  trackId!: string | null;
  currentTrack!: Track | null;
  trackArtists!: Artist[] | null;
  usersListening: User[] | null = [];
  trackArtistsRange0: number = 0;
  trackArtistsRange1: number = 5;
  usersListeningRange0: number = 0;
  usersListeningRange1: number = 5;
  trackAudioInfo: any;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {

    this.route.paramMap.subscribe(params => {
      this.trackId = params.get('track_id');
    });

    this.currentTrack = await this.userService.getTrackById(this.trackId);

    this.trackArtists = [];

    for (let index = 0; index < this.currentTrack!.artistList.length; index++) {
      let artist = await this.userService.getArtistById(this.currentTrack!.artistList[index].id);
      this.trackArtists?.push(artist!);
    }

    this.trackAudioInfo = await this.userService.getTrackAudioInformation(this.trackId);
    this.usersListening = await this.userService.getUsersListeningToTrack(this.currentTrack!.id);
  }

  getPitchClass(key: number): string {
    switch (key) {
      case 0: return 'C';
      case 1: return 'C♯/D♭';
      case 2: return 'D';
      case 3: return 'D♯/E♭';
      case 4: return 'E';
      case 5: return 'F';
      case 6: return 'F♯/G♭';
      case 7: return 'G';
      case 8: return 'G♯/A♭';
      case 9: return 'A';
      case 10: return 'A♯/B♭';
      case 11: return 'B';
      case -1: return '-';
      default: return 'Unknown';
    }
  }

  convertMillisecondsToMinutesAndSeconds(milliseconds: number): string {
    var totalSeconds = Math.floor(milliseconds / 1000);

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

    return minutes + ':' + formattedSeconds;
  }

  redirectToSpotifyPage() {
    window.open(this.currentTrack?.href, '_blank');
  }

  lowerTrackArtistsRange() {
    if (this.trackArtistsRange0 >= 5) {
      this.trackArtistsRange0 -= 5;
      this.trackArtistsRange1 -= 5;
    }
  }

  increaseTrackArtistsRange() {
    if (this.trackArtistsRange1 < this.trackArtists!.length) {
      this.trackArtistsRange0 += 5;
      this.trackArtistsRange1 += 5;
    }
  }

  lowerUsersListeningRange() {
    if (this.usersListeningRange0 >= 5) {
      this.usersListeningRange0 -= 5;
      this.usersListeningRange1 -= 5;
    }
  }

  increaseUsersListeningRange() {
    if (this.usersListeningRange1 < this.usersListening!.length) {
      this.usersListeningRange0 += 5;
      this.usersListeningRange1 += 5;
    }
  }
}
