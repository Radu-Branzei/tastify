import { Artist } from "./artist.interface";

export interface Track {
    id: string;
    name: string;
    imageUrl: string;
    artistList: Artist[];
    href: string;
    popularityScore: number;
    duration: number;
    uri: string;
}