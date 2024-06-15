import { Injectable, Injector } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Track } from '../interfaces/track.interface';
import { Artist } from '../interfaces/artist.interface';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  CLIENT_ID: string = 'd960bf8a4afa4378ba225b460948676a';
  CLIENT_SECRET: string = '19538f9f7417443488a60d203d8ae64a';
  REDIRECT_URI: string = 'http://localhost:4200/redirect';

  scopes: string = 'user-top-read user-read-private user-read-email user-read-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state';
  AUTH_URL: string = `https://accounts.spotify.com/authorize?client_id=${this.CLIENT_ID}&response_type=token&show_dialog=true&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&scope=${encodeURIComponent(this.scopes)}`;
  TOKEN_URL: string = 'https://accounts.spotify.com/api/token';

  API_URL: string = 'http://localhost:9002/api/user/';

  checkInterval: number = 1000;

  constructor(private userService: UserService, private http: HttpClient) { }

  redirectToAuthorization() {
    window.location.href = this.AUTH_URL;
  }

  handleAuthorizationCallback() {

    const params = new URLSearchParams(window.location.hash.substring(1));
    const access_token = params.get('access_token');

    if (access_token) {

      localStorage.setItem('spotifyAccessToken', access_token);
      localStorage.setItem('tokenAcquiredAt', new Date().getTime().toString());

      const expiresIn = params.get('expires_in');
      if (expiresIn) {
        const expirationTime = new Date().getTime() + parseInt(expiresIn) * 1000;
        localStorage.setItem('tokenExpirationTime', expirationTime.toString());
      }
    }
    else {
      console.log("No access token");
    }
    this.removeAccessTokenFromUrl();
  }

  removeAccessTokenFromUrl() {
    const urlWithoutHash = window.location.href.split('#')[0];
    window.history.replaceState({}, document.title, urlWithoutHash);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('spotifyAccessToken');
  }

  getLoggedInUserData() {
    const storedData = localStorage.getItem('userData');
    const userData = JSON.parse(storedData!);
    return userData;
  }

  logOut() {
    localStorage.clear();
    window.location.href = this.REDIRECT_URI;
    this.removeAccessTokenFromUrl();
  }

  isAccessTokenExpired(): boolean {
    let expirationTimeStr = localStorage.getItem('tokenExpirationTime');
    if (expirationTimeStr != null) {
      const expirationTime = parseInt(expirationTimeStr, 10);
      const currentTime = new Date().getTime();
      return currentTime > expirationTime;
    }
    return false;
  }

  checkForExistingAccount(userId: string) {
    let hasAccount: Boolean = true;
    this.http.get("http://localhost:9002/api/user/" + userId)
      .subscribe((data: any) => {
        console.log(data.data.length);
        if (data.data.length > 0 || data == undefined) {
          hasAccount = true;
        }
        else {
          hasAccount = false;
        }
        if (!hasAccount) {
          this.createUser(this.userService.userData.id, this.userService.userData.display_name,
            this.userService.userData.email, this.userService.userData.images[1].url, 0);
        }
        this.updateUserListeningInfo(this.userService.userData.id);
      });
  }

  createUser(id: string, username: string, email: string, imageUrl: string, obscurityScore: number) {
    const userDetails = { id, username, email, imageUrl, obscurityScore };
    this.http.post('http://localhost:9002/api/user/add', userDetails)
      .subscribe(response => {
      });
  }

  async updateUserListeningInfo(userId: string) {

    let tracks1: Track[] | null = [];
    let tracks2: Track[] | null = [];
    let tracks3: Track[] | null = [];
    let artists1: Artist[] | null = [];
    let artists2: Artist[] | null = [];
    let artists3: Artist[] | null = [];

    tracks1 = await this.userService.getUsersTopTracks(1);
    tracks2 = await this.userService.getUsersTopTracks(2);
    tracks3 = await this.userService.getUsersTopTracks(3);

    artists1 = await this.userService.getUsersTopArtists(1);
    artists2 = await this.userService.getUsersTopArtists(2);
    artists3 = await this.userService.getUsersTopArtists(3);

    let allTracks: Track[] = [];
    let allArtists: Artist[] = [];

    for (let index = 0; index < tracks1!.length; index++) {
      let alreadyExists: Boolean = false;
      for (let i = 0; i < allTracks.length; i++) {
        if (tracks1![index].id == allTracks[i].id) {
          alreadyExists = true;
        }
      }
      if (!alreadyExists) {
        allTracks.push(tracks1![index]);
      }
    }
    for (let index = 0; index < tracks2!.length; index++) {
      let alreadyExists: Boolean = false;
      for (let i = 0; i < allTracks.length; i++) {
        if (tracks2![index].id == allTracks[i].id) {
          alreadyExists = true;
        }
      }
      if (!alreadyExists) {
        allTracks.push(tracks2![index]);
      }
    }
    for (let index = 0; index < tracks3!.length; index++) {
      let alreadyExists: Boolean = false;
      for (let i = 0; i < allTracks.length; i++) {
        if (tracks3![index].id == allTracks[i].id) {
          alreadyExists = true;
        }
      }
      if (!alreadyExists) {
        allTracks.push(tracks3![index]);
      }
    }
    for (let index = 0; index < allTracks!.length; index++) {
      const userTrackDetails = { user_id: userId, track_id: allTracks![index].id };
      this.http.post('http://localhost:9002/api/user_track/add', userTrackDetails)
        .subscribe((response: any) => {
          if (response.status == true) {
            console.log("ADDED " + userId + " TO TRACK " + allTracks![index].id);
          }
        });
    }

    for (let index = 0; index < artists1!.length; index++) {
      let alreadyExists: Boolean = false;
      for (let i = 0; i < allArtists.length; i++) {
        if (artists1![index].id == allArtists[i].id) {
          alreadyExists = true;
        }
      }
      if (!alreadyExists) {
        allArtists.push(artists1![index]);
      }
    }
    for (let index = 0; index < artists2!.length; index++) {
      let alreadyExists: Boolean = false;
      for (let i = 0; i < allArtists.length; i++) {
        if (artists2![index].id == allArtists[i].id) {
          alreadyExists = true;
        }
      }
      if (!alreadyExists) {
        allArtists.push(artists2![index]);
      }
    }
    for (let index = 0; index < artists3!.length; index++) {
      let alreadyExists: Boolean = false;
      for (let i = 0; i < allArtists.length; i++) {
        if (artists3![index].id == allArtists[i].id) {
          alreadyExists = true;
        }
      }
      if (!alreadyExists) {
        allArtists.push(artists3![index]);
      }
    }
    for (let index = 0; index < allArtists!.length; index++) {
      const userArtistDetails = { user_id: userId, artist_id: allArtists![index].id };
      this.http.post('http://localhost:9002/api/user_artist/add', userArtistDetails)
        .subscribe((response: any) => {
          if (response.status == true) {
            console.log("ADDED " + userId + " TO ARTIST " + allArtists![index].id);
          }
        });
    }
  }

  async updateObscurityScore(obscurityScore: number) {
    let userData = this.getLoggedInUserData();
    const userDetails = {
      id: userData.id, username: userData.display_name,
      email: userData.email, imageUrl: userData.images[1].url, obscurityScore: obscurityScore
    };
    this.http.put(`http://localhost:9002/api/user/update`, userDetails)
      .subscribe(response => {
        console.log("Updated successfully");
      }, error => {
        console.error("Failed to update user details", error);
      });
  }

  async getAverageObscurityScore(): Promise<number> {

    return new Promise<number>((resolve, reject) => {
      this.http.get("http://localhost:9002/api/obscurity")
        .subscribe((data: any) => {
          if (data && data.data && data.data.length > 0) {
            resolve(data.data[0].average_obscurity_score);
          } else {
            reject(new Error("No data found"));
          }
        }, (error) => {
          reject(error);
        });
    });

  }

  async updateAverageObscurityScore() {

    this.http.get("http://localhost:9002/api/user")
      .subscribe((data: any) => {
        console.log(data);
        let totalScore = 0;
        let registered_users = 0;
        for (let index = 0; index < data.data.length; index++) {
          totalScore += data.data[index].obscurityScore;
          if (data.data[index].obscurityScore > 0) {
            registered_users++;
          }
        }
        totalScore = totalScore / registered_users;
        const newDetails = {
          id: 2, average_obscurity_score: totalScore
        };
        this.http.put(`http://localhost:9002/api/obscurity/update`, newDetails)
          .subscribe(response => {
            console.log("Updated successfully");
          }, error => {
            console.error("Failed to update user details", error);
          });
      });
  }

  // fetchToken() {
  //   var authParameters = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: 'grant_type=client_credentials&client_id=' + this.CLIENT_ID + '&client_secret=' + this.CLIENT_SECRET
  //   }

  //   fetch(this.TOKEN_URL, authParameters)
  //     .then(result => result.json())
  //     .then(data => this.access_token = data.access_token)
  //     .catch(error => console.error('Error fetching token: ', error));
  // }
}
