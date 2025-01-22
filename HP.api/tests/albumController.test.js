const request = require('supertest');
const express = require('express');
const albumRoutes = require('../src/routes/albumsRoutes');
const { fetchAlbumsFromItunes } = require('../src/services/albumService');

const app = express();
app.use(express.json());
app.use('/api', albumRoutes);

jest.mock('../src/services/albumService');

describe('GET /api/albums', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if artist is not provided', async () => {
        const response = await request(app).get('/api/albums');

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('Artist name is required');
    });

    it('should return 404 if no albums found', async () => {
        fetchAlbumsFromItunes.mockResolvedValue([]);

        const response = await request(app).get('/api/albums?artist=SomeArtist');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No albums found for artist: SomeArtist');
    });

    it('should return a list of albums', async () => {
        fetchAlbumsFromItunes.mockResolvedValue([
            { artist: 'Artist', title: 'Album Title', releaseDate: '2025-01-21', genre: 'Pop', artwork: 'image_url' }
        ]);

        const response = await request(app).get('/api/albums?artist=SomeArtist');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].artist).toBe('Artist');
        expect(response.body[0].title).toBe('Album Title');
    });

    it('should return a list of albums filtering duplicates by album name', async () => {
        fetchAlbumsFromItunes.mockResolvedValue([
            { artist: 'Artist', title: 'Album Title', releaseDate: '2025-01-21', genre: 'Pop', artwork: 'image_url' },
            { artist: 'Artist', title: 'Album Title', releaseDate: '2025-01-21', genre: 'Pop', artwork: 'image_url' },
            { artist: 'Artist different', title: 'Album Title', releaseDate: '2025-01-21', genre: 'Rock', artwork: 'image_url' }
        ]);

        const response = await request(app).get('/api/albums?artist=SomeArtist');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].artist).toBe('Artist');
        expect(response.body[0].title).toBe('Album Title');
    });

    it('should return 500 if the iTunes API call fails', async () => {
        fetchAlbumsFromItunes.mockImplementation(() => {
            throw new Error('Failed to fetch albums');
          });
        //.mockRejectedValueOnce(new Error('Failed to fetch albums'));

        const response = await request(app).get('/api/albums?artist=SomeArtist');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('An internal server error occurred');
        expect(response.body.error).toBe('Failed to fetch albums');
    });

    it('should return cached data on subsequent requests with the same artist and it does not have to be case sensitive', async () => {
        fetchAlbumsFromItunes.mockResolvedValue([
            { artist: 'Artist', title: 'Album Title', releaseDate: '2025-01-21', genre: 'Pop', artwork: 'image_url' }
        ]);
    
        const firstResponse = await request(app).get('/api/albums?artist=Some Artist');
        
        expect(firstResponse.status).toBe(200);
        expect(firstResponse.body).toHaveLength(1);
        expect(firstResponse.body[0].artist).toBe('Artist');
        expect(firstResponse.body[0].title).toBe('Album Title');
        expect(fetchAlbumsFromItunes).toHaveBeenCalledTimes(1);
    
        const secondResponse = await request(app).get('/api/albums?artist=Some Artist');
    
        expect(secondResponse.status).toBe(200);
        expect(secondResponse.body).toHaveLength(1);
        expect(secondResponse.body[0].artist).toBe('Artist');
        expect(secondResponse.body[0].title).toBe('Album Title');
        expect(fetchAlbumsFromItunes).toHaveBeenCalledTimes(1);

        const thirdResponse = await request(app).get('/api/albums?artist=some artist');
    
        expect(thirdResponse.status).toBe(200);
        expect(thirdResponse.body).toHaveLength(1);
        expect(thirdResponse.body[0].artist).toBe('Artist');
        expect(thirdResponse.body[0].title).toBe('Album Title');
        expect(fetchAlbumsFromItunes).toHaveBeenCalledTimes(1);
      });
});
