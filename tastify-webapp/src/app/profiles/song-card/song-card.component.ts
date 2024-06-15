import { Component, Input, OnInit } from '@angular/core';
import { Artist } from '../../interfaces/artist.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PopUpService } from '../../services/pop-up.service';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss'
})
export class SongCardComponent implements OnInit {

  @Input() trackId!: string;
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() artistList: Artist[] | null | any = [];
  @Input() href!: string;
  @Input() uri!: string;

  constructor(private router: Router, private userService: UserService, private popUpService: PopUpService) { }

  ngOnInit(): void {
    console.log(this.artistList);
  }

  async playTrack(trackUri: string): Promise<void> {
    let playbackState = await this.userService.getPlaybackState();
    if (playbackState == null) {
      this.popUpErrorMessage();
    }
    else {
      this.userService.playTrack(trackUri);
    }
  }

  redirectToArtistPage(artistId: string) {
    this.router.navigate(['/artist', artistId]);
  }

  redirectToTrackPage(trackId: string) {
    this.router.navigate(['/track', trackId]);
  }

  redirectToSpotifyPage(link: string) {
    console.log(link);
    window.open(link, '_blank');
  }

  popUpErrorMessage() {
    this.popUpService.showPopUp('Connect to Spotify on your device to play tracks.');
  }
}
