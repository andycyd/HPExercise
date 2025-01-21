const itunesBaseUrl = process.env.ITUNES_SEARCH_BASE_URL || 'https://itunes.apple.com/search';
const searchCountry = process.env.ITUNES_COUNTRY_CODE || 'US';
const axios = require('axios');

const fetchAlbumsFromItunes = async (artist) => {
  try {
    const itunesUrl = `${itunesBaseUrl}?country=${searchCountry}&media=music&entity=album&term=${encodeURIComponent(artist)}`;
    const response = await axios.get(itunesUrl);

    return response.data.results.map(album => ({
      artist: album.artistName,
      title: album.collectionName,
      releaseDate: album.releaseDate,
      artwork: album.artworkUrl100,
      genre: album.primaryGenreName,
      itunesUrl: album.collectionViewUrl
    }));
  } catch (error) {
    console.error('Error fetching albums:', error.message);
    throw new Error('Failed to fetch albums from iTunes');
  }
};

module.exports = { fetchAlbumsFromItunes };
