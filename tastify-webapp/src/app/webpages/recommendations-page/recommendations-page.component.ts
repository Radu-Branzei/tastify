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
import { TrackOrArtist } from '../../interfaces/track-or-artist.interface';

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
  lastSearchInput: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  async ngOnInit(): Promise<void> {
  }

  async onEnter(event: Event): Promise<void> {

    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Enter') {
      this.lastSearchInput = this.searchInput;
      this.artistsFound = await this.userService.getArtistsBySearch(this.searchInput);
      this.tracksFound = await this.userService.getTracksBySearch(this.searchInput);
    }
  }

  async setRecommendedTracks(): Promise<void> {

    if (this.filterList?.length == 0) {
      this.recommendedTracks = [];
    }

    this.recommendedTracks = await this.userService.getRecommendedTracks(this.filterArtists!, this.filterTracks!);
  }

  isTrack(item: TrackOrArtist): item is Track {
    return (item as Track).duration !== undefined;
  }

  isArtist(item: TrackOrArtist): item is Artist {
    return (item as Artist).followersCount !== undefined;
  }

  async addTrack(track: Track) {

    if (this.filterList!.length >= 5 || this.isInFilterList(track)) {
      return;
    }

    this.filterTracks!.push(track);
    this.filterList!.push(track);

    this.setRecommendedTracks();
  }

  async addArtist(artist: Artist) {

    if (this.filterList!.length >= 5 || this.isInFilterList(artist)) {
      return;
    }

    this.filterArtists!.push(artist);
    this.filterList!.push(artist);

    this.setRecommendedTracks();
  }

  isInFilterList(item: TrackOrArtist): boolean {
    let found: boolean = false;

    this.filterList?.forEach(element => {
      if (item.id == element.id) {
        found = true;
      }
    });

    return found;
  }

  removeFromFilterList(item: TrackOrArtist) {
    let idToRemove = item.id;
    this.filterList = this.filterList!.filter(item => item.id !== idToRemove);
    if (this.isArtist(item)) {
      this.filterArtists = this.filterArtists!.filter(item => item.id !== idToRemove);
    }
    else if (this.isTrack(item)) {
      this.filterTracks = this.filterTracks!.filter(item => item.id !== idToRemove);
    }

    this.setRecommendedTracks();
  }

  getTrack(item: TrackOrArtist) {
    return (this.isTrack(item)) ? item : null;
  }

  getArtist(item: TrackOrArtist) {
    return (this.isArtist(item)) ? item : null;
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
