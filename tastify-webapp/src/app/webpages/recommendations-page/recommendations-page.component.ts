import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Track } from '../../interfaces/track.interface';
import { fadeIn } from '../../interfaces/animations';
import { Artist } from '../../interfaces/artist.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArtistCardComponent } from "../../profiles/artist-card/artist-card.component";
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { TrackOrArtist, isArtist, isTrack } from '../../interfaces/track-or-artist.interface';

@Component({
  selector: 'app-recommendations-page',
  templateUrl: './recommendations-page.component.html',
  styleUrl: './recommendations-page.component.scss',
  standalone: true,
  animations: [
    fadeIn
  ],
  imports: [FormsModule, CommonModule, ArtistCardComponent, SongCardComponent]
})
export class RecommendationsPageComponent implements OnInit {

  recommendedTracks: Track[] | null = [];
  recommendedTracksRange0: number = 0;
  recommendedTracksRange1: number = 5;

  filterList: TrackOrArtist[] | null = [];
  filterTracks: Track[] | null = [];
  filterArtists: Artist[] | null = [];

  artistsFound: Artist[] | null = [];
  artistsFoundRange0: number = 0;
  artistsFoundRange1: number = 5;
  tracksFound: Track[] | null = [];
  tracksFoundRange0: number = 0;
  tracksFoundRange1: number = 5;
  searchInput!: string;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.filterArtists = await this.userService.getUsersTopArtists(1);
    this.filterArtists?.slice(0, 1);
    this.setRecommendedTracks();
  }

  async onEnter(event: Event): Promise<void> {

    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter') {
      this.artistsFound = await this.userService.getArtistsBySearch(this.searchInput);
      this.tracksFound = await this.userService.getTracksBySearch(this.searchInput);
    }
  }

  async setRecommendedTracks(): Promise<void> {
    console.log(this.filterArtists);
    this.recommendedTracks = await this.userService.getRecommendedTracks(this.filterArtists!, [], 0);
  }

  async addTrack(trackId: string) {
    let addedTrack: Track | null;
    addedTrack = await this.userService.getTrackById(trackId);
    this.filterTracks!.push(addedTrack!);
  }

  async addArtist(artistId: string) {
    let addedArtist: Artist | null;
    addedArtist = await this.userService.getArtistById(artistId);
    this.filterArtists!.push(addedArtist!);
  }

  lowerArtistsFoundRange() {
    if (this.artistsFoundRange0 >= 5) {
      this.artistsFoundRange0 -= 5;
      this.artistsFoundRange1 -= 5;
    }
  }

  increaseArtistsFoundRange() {
    if (this.artistsFoundRange1 < this.artistsFound!.length) {
      this.artistsFoundRange0 += 5;
      this.artistsFoundRange1 += 5;
    }
  }

  lowerTracksFoundRange() {
    if (this.tracksFoundRange0 >= 5) {
      this.tracksFoundRange0 -= 5;
      this.tracksFoundRange1 -= 5;
    }
  }

  increaseTracksFoundRange() {
    if (this.tracksFoundRange1 < this.tracksFound!.length) {
      this.tracksFoundRange0 += 5;
      this.tracksFoundRange1 += 5;
    }
  }

  lowerRecommendedTracksRange() {
    if (this.recommendedTracksRange0 >= 5) {
      this.recommendedTracksRange0 -= 5;
      this.recommendedTracksRange1 -= 5;
    }
  }

  increaseRecommendedTracksRange() {
    if (this.recommendedTracksRange1 < this.recommendedTracks!.length) {
      this.recommendedTracksRange0 += 5;
      this.recommendedTracksRange1 += 5;
    }
  }
}
