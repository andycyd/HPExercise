const cacheTTS = process.env.ALBUMS_CACHE_TTL_SECONDS || 3600;
const { fetchAlbumsFromItunes } = require('../services/albumService');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: cacheTTS });

const getAlbums = async (req, res, next) => {
    const { artist } = req.query;

    const cachedData = cache.get(artist.toLowerCase());
    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    try {
        const albums = await fetchAlbumsFromItunes(artist);

        if (albums.length === 0) {
            return res.status(404).json({ message: `No albums found for artist: ${artist}` });
        }

        cache.set(artist.toLowerCase(), albums);
        res.status(200).json(albums);
    } 
    catch (error) {
        console.error('Error fetching albums:', error.message);
        next(error);
    }
};

module.exports = { getAlbums };
