import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Artist } from '../../interfaces/artist.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { Track } from '../../interfaces/track.interface';
import { ArtistCardComponent } from "../../profiles/artist-card/artist-card.component";

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss',
  imports: [CommonModule, TruncatePipe, SongCardComponent, ArtistCardComponent]
})
export class UserProfilePageComponent implements OnInit {

  myData: any;
  userId!: string | null;
  currentUser!: User | null;
  commonTracks!: Track[] | null;
  commonTracksRange0: number = 0;
  commonTracksRange1: number = 5;
  commonArtists!: Artist[] | null;
  commonArtistsRange0: number = 0;
  commonArtistsRange1: number = 5;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('user_id');
    });

    this.myData = this.authService.getLoggedInUserData();
    this.currentUser = await this.userService.getUserById(this.userId);
    this.commonTracks = await this.userService.getCommonTracks(this.myData.id, this.userId!);
    this.commonArtists = await this.userService.getCommonArtists(this.myData.id, this.userId!);
    // this.currentArtist = await this.userService.getArtistById(this.artistId);
    // this.topTracks = await this.userService.getArtistsTopTracks(this.artistId);
    // this.topAlbums = await this.userService.getAlbumsByArtist(this.artistId);
  }

  redirectToSpotifyPage() {
    return;
  }

  lowerCommonTracksRange() {
    if (this.commonTracksRange0 >= 5) {
      this.commonTracksRange0 -= 5;
      this.commonTracksRange1 -= 5;
    }
  }

  increaseCommonTracksRange() {
    if (this.commonTracksRange1 < this.commonTracks!.length) {
      this.commonTracksRange0 += 5;
      this.commonTracksRange1 += 5;
    }
  }

  lowerCommonArtistsRange() {
    if (this.commonArtistsRange0 >= 5) {
      this.commonArtistsRange0 -= 5;
      this.commonArtistsRange1 -= 5;
    }
  }

  increaseCommonArtistsRange() {
    if (this.commonArtistsRange1 < this.commonArtists!.length) {
      this.commonArtistsRange0 += 5;
      this.commonArtistsRange1 += 5;
    }
  }
}
