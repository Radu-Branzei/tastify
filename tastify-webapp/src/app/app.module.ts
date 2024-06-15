import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ArtistCardComponent } from './profiles/artist-card/artist-card.component';
import { SongCardComponent } from './profiles/song-card/song-card.component';
import { ArtistPageComponent } from './webpages/artist-page/artist-page.component';
import { HomePageComponent } from './webpages/home-page/home-page.component';
import { ListeningInfoPageComponent } from './webpages/listening-info-page/listening-info-page.component';
import { LogInPageComponent } from './webpages/log-in-page/log-in-page.component';
import { MyProfilePageComponent } from './webpages/my-profile-page/my-profile-page.component';
import { TrackPageComponent } from './webpages/track-page/track-page.component';
import { SearchResultsPageComponent } from './webpages/search-results-page/search-results-page.component';
import { HeaderMenuComponent } from './widgets/header-menu/header-menu.component';
import { PlayerBarComponent } from './widgets/player-bar/player-bar.component';
import { SearchBarComponent } from './widgets/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ObscurityPageComponent } from './webpages/obscurity-page/obscurity-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TruncatePipe } from './pipes/truncate.pipe';
import { RecommendationsPageComponent } from './webpages/recommendations-page/recommendations-page.component';
import { RedirectPageComponent } from './webpages/redirect-page/redirect-page.component';
import { PopUpBarComponent } from './widgets/pop-up-bar/pop-up-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    RedirectPageComponent,
    PopUpBarComponent,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ArtistCardComponent,
    SongCardComponent,
    HeaderMenuComponent,
    PlayerBarComponent,
    LogInPageComponent,
    HomePageComponent,
    RecommendationsPageComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    BrowserAnimationsModule,
    SearchBarComponent
  ]
})
export class AppModule { }
