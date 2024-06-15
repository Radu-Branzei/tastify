import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [],
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.scss'
})
export class ArtistCardComponent {

  @Input() artistId!: string;
  @Input() imageUrl!: string;
  @Input() name!: string;
  @Input() href!: string;

  constructor(private router: Router) { }

  redirectToArtistPage() {
    this.router.navigate(['/artist', this.artistId]);
  }

  redirectToSpotifyPage() {
    window.open(this.href, '_blank');
  }
}
