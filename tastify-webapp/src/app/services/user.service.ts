import { Injectable } from '@angular/core';
//import { AuthService } from './auth.service';
import { Artist } from '../interfaces/artist.interface';
import { Track } from '../interfaces/track.interface';
import { Subject, lastValueFrom } from 'rxjs';
import { Album } from '../interfaces/album.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentlyPlayingTrack!: Track | null;
  userData: any;

  constructor(private http: HttpClient) { }

  getRequiredGETParameters() {
    return {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('spotifyAccessToken')
      }
    }
  }

  getRequiredPUTParameters() {
    return {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('spotifyAccessToken')
      }
    }
  }

  getRequiredPOSTParameters() {
    return {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('spotifyAccessToken')
      }
    }
  }

  getRequiredPUTPlayParameters(body?: any) {
    return {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('spotifyAccessToken'),
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    }
  }

  async getUsersProfileInfo() {

    var fetchedData = await fetch('https://api.spotify.com/v1/me', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { console.log(data); return data; });

    this.userData = fetchedData;
    localStorage.setItem('userData', JSON.stringify(fetchedData));
    return fetchedData;
  }

  async getUsersTopTracks(timelineOption: number): Promise<Track[] | null> {

    let usersTopTracks: Track[] | null = [];

    let time_range: string = (() => {
      switch (timelineOption) {
        case 1: return 'short_term';
        case 2: return 'medium_term';
        case 3: return 'long_term';
        default: return 'Invalid option';
      }
    })();

    var fetchedData = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=' + time_range + '&limit=50', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.items });

    for (let index = 0; index < fetchedData.length; index++) {
      let newTrack: Track = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: fetchedData[index].album.images[0].url,
        href: fetchedData[index].external_urls.spotify,
        artistList: fetchedData[index].artists,
        popularityScore: fetchedData[index].popularity,
        duration: fetchedData[index].duration_ms,
        uri: fetchedData[index].uri
      }
      usersTopTracks.push(newTrack);
    }

    return usersTopTracks;
  }

  async getUsersTopArtists(timelineOption: number): Promise<Artist[] | null> {

    let usersTopArtists: Artist[] | null = [];

    let time_range: string = (() => {
      switch (timelineOption) {
        case 1: return 'short_term';
        case 2: return 'medium_term';
        case 3: return 'long_term';
        default: return 'Invalid option';
      }
    })();

    var fetchedData = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=' + time_range + '&limit=50', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.items });

    for (let index = 0; index < fetchedData.length; index++) {
      let newArtist: Artist = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: fetchedData[index].images[0].url,
        href: fetchedData[index].external_urls.spotify,
        popularityScore: fetchedData[index].popularity,
        followersCount: fetchedData[index].followers.total
      }
      usersTopArtists.push(newArtist);
    }

    return usersTopArtists;
  }

  async getArtistsBySearch(searchInput: string | null): Promise<Artist[] | null> {

    let artistsBySearch: Artist[] | null = [];

    var fetchedData = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist&limit=50', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.artists.items });

    for (let index = 0; index < fetchedData.length; index++) {
      let newArtist: Artist = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: (fetchedData[index].images.length > 0) ? fetchedData[index].images[0].url : "",
        href: fetchedData[index].external_urls.spotify,
        popularityScore: fetchedData[index].popularity,
        followersCount: fetchedData[index].followers.total
      }
      artistsBySearch.push(newArtist);
    }

    return artistsBySearch;
  }

  async getArtistById(artistId: string | null): Promise<Artist | null> {

    let newArtist: Artist | null = null;

    await fetch('https://api.spotify.com/v1/artists/' + artistId, this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => {
        newArtist = {
          id: data.id,
          name: data.name,
          imageUrl: (data.images.length > 0) ? data.images[0].url : "",
          href: data.external_urls.spotify,
          popularityScore: data.popularity,
          followersCount: data.followers.total
        };
      });

    return newArtist;
  }

  async getTrackById(trackId: string | null): Promise<Track | null> {

    let newTrack: Track | null = null;

    await fetch('https://api.spotify.com/v1/tracks/' + trackId, this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => {
        newTrack = {
          id: data.id,
          name: data.name,
          imageUrl: (data.album.images.length > 0) ? data.album.images[0].url : "",
          artistList: data.artists,
          href: data.external_urls.spotify,
          popularityScore: data.popularity,
          duration: data.duration_ms,
          uri: data.uri
        };
      });

    return newTrack;
  }

  async getArtistsTopTracks(artistId: string | null): Promise<Track[] | null> {

    let artistsTopTracks: Track[] = [];

    var fetchedData = await fetch('https://api.spotify.com/v1/artists/' + artistId + '/top-tracks', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.tracks; });

    for (let index = 0; index < fetchedData.length; index++) {
      let newTrack: Track = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: (fetchedData[index].album.images.length > 0) ? fetchedData[index].album.images[0].url : "",
        href: fetchedData[index].external_urls.spotify,
        artistList: fetchedData[index].artists,
        popularityScore: fetchedData[index].popularity,
        duration: fetchedData[index].duration_ms,
        uri: fetchedData[index].uri
      }
      artistsTopTracks.push(newTrack);
    }

    return artistsTopTracks;
  }

  async getTracksBySearch(searchInput: string | null) {

    let tracksBySearch: Track[] | null = [];

    var fetchedData = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track&limit=50', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.tracks.items });

    for (let index = 0; index < fetchedData.length; index++) {
      let newTrack: Track = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: (fetchedData[index].album.images.length > 0) ? fetchedData[index].album.images[0].url : "",
        href: fetchedData[index].external_urls.spotify,
        artistList: fetchedData[index].artists,
        popularityScore: fetchedData[index].popularity,
        duration: fetchedData[index].duration_ms,
        uri: fetchedData[index].uri
      }
      tracksBySearch.push(newTrack);
    }

    return tracksBySearch;
  }

  async getAlbumsByArtist(artistId: string | null): Promise<Album[] | null> {

    let artistsTopAlbums: Album[] | null = [];

    var fetchedData = await fetch('https://api.spotify.com/v1/artists/' + artistId
      + '/albums?include_groups=album&market=US&limit=20', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.items; });

    for (let index = 0; index < fetchedData.length; index++) {
      let newAlbum: Album = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: (fetchedData[index].images.length > 0) ? fetchedData[index].images[0].url : "",
        artistList: fetchedData[index].artists,
        href: fetchedData[index].external_urls.spotify
      }
      artistsTopAlbums.push(newAlbum);
    }

    return artistsTopAlbums;
  }

  async calculateObscurityScore(): Promise<number> {

    let recentArtists: Artist[] | null = [];
    let recentTracks: Track[] | null = [];
    recentArtists = await this.getUsersTopArtists(1);
    recentTracks = await this.getUsersTopTracks(1);

    let averagePopularity: number = 0;

    for (let index = 0; index < recentTracks!.length; index++) {
      if (recentTracks != null) {
        averagePopularity += recentTracks[index].popularityScore;
      }
    }

    for (let index = 0; index < recentArtists!.length; index++) {
      if (recentArtists != null) {
        averagePopularity += recentArtists[index].popularityScore;
      }
    }

    averagePopularity = averagePopularity / (recentTracks!.length + recentArtists!.length);
    let averagePopularityString = averagePopularity.toFixed(2);
    console.log("AP: " + averagePopularityString);

    return averagePopularity;
  }

  async getSimilarUsers(obscurityScore: number): Promise<User[] | null> {

    let similarUsers: User[] = [];

    const storedData = localStorage.getItem('userData');
    const userData = JSON.parse(storedData!);

    this.http.get("http://localhost:9002/api/user")
      .subscribe((data: any) => {
        for (let index = 0; index < data.data.length; index++) {
          if (data.data[index].id != userData.id) {
            let newUser: User = {
              id: data.data[index].id,
              name: data.data[index].username,
              imageUrl: data.data[index].imageUrl,
              href: data.data[index].href,
              followersCount: data.data[index].followers,
              obscurityScore: data.data[index].obscurityScore
            }
            similarUsers.push(newUser);
          }
        }
        similarUsers.sort((a, b) => Math.abs(a.obscurityScore - obscurityScore) - Math.abs(b.obscurityScore - obscurityScore));
        console.log(similarUsers);
      });

    console.log(similarUsers);

    return similarUsers;
  }

  async getUserById(userId: string | null): Promise<User | null> {

    if (!userId) {
      return null;
    }

    const response = await lastValueFrom(this.http.get<{ data: any }>('http://localhost:9002/api/user/' + userId));
    const data = response.data[0];

    const user: User = {
      id: data.id,
      name: data.username,
      imageUrl: data.imageUrl,
      href: data.href,
      followersCount: data.followers,
      obscurityScore: data.obscurityScore
    };

    return user;
  }

  async getUsersBySearch(searchInput: string | null): Promise<User[] | null> {

    let filteredUsers: User[] = [];

    this.http.get('http://localhost:9002/api/user')
      .subscribe((data: any) => {
        for (let index = 0; index < data.data.length; index++) {
          if (data.data[index].id != this.userData.id &&
            data.data[index].username.toLowerCase().includes(searchInput!.toLowerCase())) {
            let newUser: User = {
              id: data.data[index].id,
              name: data.data[index].username,
              imageUrl: data.data[index].imageUrl,
              href: data.data[index].href,
              followersCount: data.data[index].followers,
              obscurityScore: data.data[index].obscurityScore
            }
            filteredUsers.push(newUser);
          }
        }
      });

    return filteredUsers;
  }

  async getUsersListeningToTrack(trackId: string | null) {

    let usersListening: User[] = [];

    this.http.get('http://localhost:9002/api/user_track/' + trackId)
      .subscribe(async (data: any) => {
        console.log(data);
        for (let index = 0; index < data.data.length; index++) {
          if (data.data[index].user_id != this.userData.id) {
            let newUser: User | null;
            newUser = await this.getUserById(data.data[index].user_id);
            usersListening.push(newUser!);
          }
        }
      });

    return usersListening;
  }

  async getUsersListeningToArtist(artistId: string | null) {

    let usersListening: User[] = [];

    this.http.get('http://localhost:9002/api/user_artist/' + artistId)
      .subscribe(async (data: any) => {
        console.log(data);
        for (let index = 0; index < data.data.length; index++) {
          if (data.data[index].user_id != this.userData.id) {
            let newUser: User | null;
            newUser = await this.getUserById(data.data[index].user_id);
            usersListening.push(newUser!);
          }
        }
      });

    return usersListening;
  }

  async getTrackAudioInformation(trackId: string | null) {

    var trackInformation = await fetch('https://api.spotify.com/v1/audio-features/' + trackId, this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data; });

    return trackInformation;
  }

  async getAvailableGenreSeeds(): Promise<string[] | null> {

    let availableGenres: string[] | null = [];

    availableGenres = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data; });

    return availableGenres;
  }

  async getRecommendedTracks(artists: Artist[], tracks: Track[]): Promise<Track[] | null> {

    let recommendedTracks: Track[] | null = [];

    let artistIds = artists.map(artist => artist.id).join(',');
    let trackIds = tracks.map(track => track.id).join(',');

    var fetchedData = await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${artistIds}&seed_tracks=${trackIds}`, this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.tracks; });

    for (let index = 0; index < fetchedData.length; index++) {
      let track: Track = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: fetchedData[index].album.images[0].url,
        href: fetchedData[index].external_urls.spotify,
        artistList: fetchedData[index].artists,
        popularityScore: fetchedData[index].popularity,
        duration: fetchedData[index].duration_ms,
        uri: fetchedData[index].uri
      }
      recommendedTracks.push(track);
    }

    return recommendedTracks;
  }

  async getCommonTracks(firstId: string, secondId: string): Promise<Track[] | null> {

    let commonTracks: Track[] = [];

    const params = new HttpParams()
      .set('user_id1', firstId)
      .set('user_id2', secondId);

    await this.http.get('http://localhost:9002/api/common_tracks', { params })
      .subscribe(async (data: any) => {
        for (let index = 0; index < data.data.length; index++) {
          let newTrack: Track | null = await this.getTrackById(data.data[index].track_id);
          commonTracks.push(newTrack!);
        }
      });

    return commonTracks;
  }

  async getCommonArtists(firstId: string, secondId: string): Promise<Artist[] | null> {

    let commonArtists: Artist[] = [];

    const params = new HttpParams()
      .set('user_id1', firstId)
      .set('user_id2', secondId);

    await this.http.get('http://localhost:9002/api/common_artists', { params })
      .subscribe(async (data: any) => {
        for (let index = 0; index < data.data.length; index++) {
          let newArtist: Artist | null = await this.getArtistById(data.data[index].artist_id);
          commonArtists.push(newArtist!);
        }
      });

    return commonArtists;
  }

  async getPlaybackState(): Promise<any | null> {

    try {
      var playbackState = await fetch('https://api.spotify.com/v1/me/player', this.getRequiredGETParameters())
        .then(result => result.json())
        .then(data => { return data; });
      return playbackState;
    }
    catch (error) {
      console.log("User is currently not logged on Spotify.");
      return null;
    }
  }

  async getCurrentlyPlayingTrack(): Promise<Track | null> {

    var playbackStateTrack = await fetch('https://api.spotify.com/v1/me/player/currently-playing', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { return data.item });

    let newTrack: Track = {
      id: playbackStateTrack.id,
      name: playbackStateTrack.name,
      imageUrl: playbackStateTrack.album.images[0].url,
      href: playbackStateTrack.external_urls.spotify,
      artistList: playbackStateTrack.artists,
      popularityScore: playbackStateTrack.popularity,
      duration: playbackStateTrack.duration_ms,
      uri: playbackStateTrack.uri
    }

    return newTrack;
  }

  async playTrack(trackUri: string) {
    const body = {
      uris: [trackUri]
    };
    await fetch('https://api.spotify.com/v1/me/player/play', this.getRequiredPUTPlayParameters(body));
  }

  async resumePlayer() {
    await fetch('https://api.spotify.com/v1/me/player/play', this.getRequiredPUTParameters());
  }

  async pausePlayer() {
    await fetch('https://api.spotify.com/v1/me/player/pause', this.getRequiredPUTParameters());
  }

  async skipToNext() {
    await fetch('https://api.spotify.com/v1/me/player/next', this.getRequiredPOSTParameters());
  }

  async skipToPrevious() {
    await fetch('https://api.spotify.com/v1/me/player/previous', this.getRequiredPOSTParameters());
  }

  async getPreviouslyPlayedTracks(): Promise<Track[] | null> {

    let recentlyPlayedTracks: Track[] = [];

    var fetchedData = await fetch('https://api.spotify.com/v1/me/player/recently-played', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { console.log(data); return data.items });

    for (let index = 0; index < fetchedData.length; index++) {
      let newTrack: Track = {
        id: fetchedData[index].track.id,
        name: fetchedData[index].track.name,
        imageUrl: fetchedData[index].track.album.images[0].url,
        href: fetchedData[index].track.external_urls.spotify,
        artistList: fetchedData[index].track.artists,
        popularityScore: fetchedData[index].track.popularity,
        duration: fetchedData[index].track.duration_ms,
        uri: fetchedData[index].track.uri
      }
      recentlyPlayedTracks.push(newTrack);
    }

    return recentlyPlayedTracks;
  }

  async getUsersQueue(): Promise<Track[] | null> {

    let usersQueue: Track[] = [];

    var fetchedData = await fetch('https://api.spotify.com/v1/me/player/queue', this.getRequiredGETParameters())
      .then(result => result.json())
      .then(data => { console.log(data); return data.queue });

    for (let index = 0; index < fetchedData.length; index++) {
      let newTrack: Track = {
        id: fetchedData[index].id,
        name: fetchedData[index].name,
        imageUrl: fetchedData[index].album.images[0].url,
        href: fetchedData[index].external_urls.spotify,
        artistList: fetchedData[index].artists,
        popularityScore: fetchedData[index].popularity,
        duration: fetchedData[index].duration_ms,
        uri: fetchedData[index].uri
      }
      usersQueue.push(newTrack);
    }

    return usersQueue;
  }
}




