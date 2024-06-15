import { Artist } from "./artist.interface";
import { Track } from "./track.interface";

export type TrackOrArtist = Track | Artist;

export function isTrack(item: TrackOrArtist): item is Track {
    return 'duration' in item;
}

export function isArtist(item: TrackOrArtist): item is Artist {
    return 'followersCount' in item;
}