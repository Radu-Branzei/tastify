import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from '../../interfaces/artist.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.scss'
})
export class AlbumCardComponent {
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() artistList: Artist[] | null | any = [];
  @Input() href!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log(this.artistList);
  }

  redirectToArtistPage(artistId: string) {
    this.router.navigate(['/artist', artistId]);
  }

  redirectToSpotifyPage(link: string) {
    console.log(link);
    window.open(link, '_blank');
  }
}
