import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../interfaces/artist.interface';
import { Track } from '../../interfaces/track.interface';
import { UserService } from '../../services/user.service';
import { SongCardComponent } from "../../profiles/song-card/song-card.component";
import { ArtistCardComponent } from "../../profiles/artist-card/artist-card.component";
import { fadeIn } from '../../interfaces/animations';

@Component({
  selector: 'app-listening-info-page',
  standalone: true,
  templateUrl: './listening-info-page.component.html',
  styleUrl: './listening-info-page.component.scss',
  animations: [
    fadeIn
  ],
  imports: [CommonModule, SongCardComponent, ArtistCardComponent]
})
export class ListeningInfoPageComponent implements OnInit {

  topArtists!: Artist[] | null;
  topTracks!: Track[] | null;
  timelineOption: number = 1;
  informationType: string = 'artists';

  ngOnInit(): void {
    this.getListeningInfo(this.timelineOption);
  }

  constructor(private userService: UserService) { }

  async getListeningInfo(timelineOption: number): Promise<void> {

    this.timelineOption = timelineOption;

    if (this.topArtists == null && this.topTracks == null) {
      this.topArtists = await this.userService.getUsersTopArtists(timelineOption);
      this.topTracks = await this.userService.getUsersTopTracks(timelineOption);
    }
    else {
      if (this.informationType == 'artists') {
        this.topTracks = null;
        this.topArtists = await this.userService.getUsersTopArtists(timelineOption);
      } else {
        this.topArtists = null;
        this.topTracks = await this.userService.getUsersTopTracks(timelineOption);
      }
    }
  }

  getArtists(): void {
    this.informationType = 'artists';
  }

  getTracks(): void {
    this.informationType = 'tracks';
  }
}
