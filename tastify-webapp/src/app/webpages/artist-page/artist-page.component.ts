import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Artist } from '../../interfaces/artist.interface';
import { CommonModule } from '@angular/common';
import { Track } from '../../interfaces/track.interface';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { Album } from '../../interfaces/album.interface';
import { AlbumCardComponent } from '../../profiles/album-card/album-card.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { User } from '../../interfaces/user.interface';
import { UserCardComponent } from "../../profiles/user-card/user-card.component";

@Component({
  selector: 'app-artist-page',
  standalone: true,
  templateUrl: './artist-page.component.html',
  styleUrl: './artist-page.component.scss',
  imports: [CommonModule, SongCardComponent, AlbumCardComponent, TruncatePipe, UserCardComponent]
})
export class ArtistPageComponent implements OnInit, OnChanges {

  artistId!: string | null;
  topTracks!: Track[] | null;
  topTracksRange0: number = 0;
  topTracksRange1: number = 5;
  topAlbums!: Album[] | null;
  topAlbumsRange0: number = 0;
  topAlbumsRange1: number = 5;
  currentArtist!: Artist | null;
  usersListening!: User[] | null;
  usersListeningRange0: number = 0;
  usersListeningRange1: number = 5;


  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {

    this.route.paramMap.subscribe(params => {
      this.artistId = params.get('artist_id');
      console.log('Artist ID: ', this.artistId);
      this.loadArtistDetails();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artistId']) {
      this.loadArtistDetails();
    }
  }

  async loadArtistDetails(): Promise<void> {
    this.currentArtist = await this.userService.getArtistById(this.artistId);
    this.topTracks = await this.userService.getArtistsTopTracks(this.artistId);
    this.topAlbums = await this.userService.getAlbumsByArtist(this.artistId);

    this.usersListening = await this.userService.getUsersListeningToArtist(this.currentArtist!.id);

    this.topTracksRange0 = 0;
    this.topTracksRange1 = 5;
    this.topAlbumsRange0 = 0;
    this.topAlbumsRange1 = 5;
  }

  redirectToSpotifyPage() {
    window.open(this.currentArtist?.href, '_blank');
  }

  lowerTopTracksRange() {
    if (this.topTracksRange0 >= 5) {
      this.topTracksRange0 -= 5;
      this.topTracksRange1 -= 5;
    }
  }

  increaseTopTracksRange() {
    if (this.topTracksRange1 < this.topTracks!.length) {
      this.topTracksRange0 += 5;
      this.topTracksRange1 += 5;
    }
  }

  lowerTopAlbumsRange() {
    if (this.topAlbumsRange0 >= 5) {
      this.topAlbumsRange0 -= 5;
      this.topAlbumsRange1 -= 5;
    }
  }

  increaseTopAlbumsRange() {
    if (this.topAlbumsRange1 < this.topAlbums!.length) {
      this.topAlbumsRange0 += 5;
      this.topAlbumsRange1 += 5;
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
