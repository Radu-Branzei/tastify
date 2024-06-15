import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistPageComponent } from './webpages/artist-page/artist-page.component';
import { HomePageComponent } from './webpages/home-page/home-page.component';
import { ListeningInfoPageComponent } from './webpages/listening-info-page/listening-info-page.component';
import { LogInPageComponent } from './webpages/log-in-page/log-in-page.component';
import { MyProfilePageComponent } from './webpages/my-profile-page/my-profile-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ObscurityPageComponent } from './webpages/obscurity-page/obscurity-page.component';
import { TrackPageComponent } from './webpages/track-page/track-page.component';
import { SearchResultsPageComponent } from './webpages/search-results-page/search-results-page.component';
import { UserProfilePageComponent } from './webpages/user-profile-page/user-profile-page.component';
import { RecommendationsPageComponent } from './webpages/recommendations-page/recommendations-page.component';
import { RedirectPageComponent } from './webpages/redirect-page/redirect-page.component';
import { LogInGuard } from './guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, title: 'tastify | Home', canActivate: [AuthGuard] },
  { path: 'login', component: LogInPageComponent, title: 'tastify | Log In', canActivate: [LogInGuard] },
  { path: 'search-results/:search_input', title: 'tastify | Search', component: SearchResultsPageComponent, canActivate: [AuthGuard] },
  { path: 'profile/me', component: MyProfilePageComponent, title: 'tastify | My Profile', canActivate: [AuthGuard] },
  { path: 'listening-info', component: ListeningInfoPageComponent, title: 'tastify | My Listening Info', canActivate: [AuthGuard] },
  { path: 'artist/:artist_id', component: ArtistPageComponent, title: 'tastify | Artist Page', canActivate: [AuthGuard] },
  { path: 'track/:track_id', component: TrackPageComponent, title: 'tastify | Track Page', canActivate: [AuthGuard] },
  { path: 'profile/:user_id', component: UserProfilePageComponent, title: 'tastify | User Profile', canActivate: [AuthGuard] },
  { path: 'obscurity', component: ObscurityPageComponent, title: 'tastify | Obscurity', canActivate: [AuthGuard] },
  { path: 'recommendations', component: RecommendationsPageComponent, title: 'tastify | Recommendations', canActivate: [AuthGuard] },
  { path: 'redirect', component: RedirectPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
