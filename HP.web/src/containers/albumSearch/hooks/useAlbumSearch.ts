import { useMemo } from "react";

export type Album = {
    artist: string;
    title: string;
    releaseDate: string;
    artwork: string;
    genre: string;
};

export const useAlbumSearch = (searchTerm: string, callback: (albums: Album[]) => void) => {
    useMemo(() => {
        if(searchTerm === '') {
            callback([]);
            return;
        }
        //const apiUrl = process.env.API_URL || 'http://localhost:4000/api';;
        const apiUrl = 'http://localhost:4000/api';
        const fetchAlbums = async () => {
            try {
                const response = await fetch(`${apiUrl}/albums?artist=${searchTerm}`);
                if (!response.ok) {
                    callback([]);
                    return;
                }
                const data = await response.json();
                callback(data as Album[]);
            } catch {
                callback([]);
            }
        };

        fetchAlbums();
    }, [searchTerm, callback]);
};