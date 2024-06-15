import { Artist } from "./artist.interface";

export interface Album {
    id: string;
    name: string;
    imageUrl: string;
    artistList: Artist[];
    href: string;
}
