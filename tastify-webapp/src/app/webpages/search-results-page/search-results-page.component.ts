import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Artist } from '../../interfaces/artist.interface';
import { ArtistCardComponent } from "../../profiles/artist-card/artist-card.component";
import { CommonModule } from '@angular/common';
import { Track } from '../../interfaces/track.interface';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { fadeIn } from '../../interfaces/animations';
import { UserCardComponent } from "../../profiles/user-card/user-card.component";
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-search-results-page',
  standalone: true,
  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.scss',
  animations: [
    fadeIn
  ],
  imports: [ArtistCardComponent, CommonModule, SongCardComponent, UserCardComponent]
})
export class SearchResultsPageComponent implements OnInit, OnChanges {

  searchInput!: string | null;
  artistsFound!: Artist[] | null;
  artistsFoundRange0: number = 0;
  artistsFoundRange1: number = 5;
  tracksFound!: Track[] | null;
  tracksFoundRange0: number = 0;
  tracksFoundRange1: number = 5;
  usersFound!: User[] | null;
  usersFoundRange0: number = 0;
  usersFoundRange1: number = 5;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.artistsFound = null;
    this.tracksFound = null;
    this.usersFound = null;

    this.route.paramMap.subscribe(params => {
      this.searchInput = params.get('search_input');
      this.loadSearchDetails();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchInput']) {
      this.loadSearchDetails();
    }
  }

  async loadSearchDetails(): Promise<void> {
    this.search();

    this.artistsFoundRange0 = 0;
    this.artistsFoundRange1 = 5;
    this.tracksFoundRange0 = 0;
    this.tracksFoundRange1 = 5;
    this.usersFoundRange0 = 0;
    this.usersFoundRange1 = 5;
  }

  async search(): Promise<void> {
    try {
      this.artistsFound = await this.userService.getArtistsBySearch(this.searchInput);
      this.tracksFound = await this.userService.getTracksBySearch(this.searchInput);
      this.usersFound = await this.userService.getUsersBySearch(this.searchInput);
    } catch (error) {
      console.error('Error during search:', error);
    }
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

  lowerUsersFoundRange() {
    if (this.usersFoundRange0 >= 5) {
      this.usersFoundRange0 -= 5;
      this.usersFoundRange0 -= 5;
    }
  }

  increaseUsersFoundRange() {
    if (this.usersFoundRange1 < this.usersFound!.length) {
      this.usersFoundRange0 += 5;
      this.usersFoundRange1 += 5;
    }
  }
}
