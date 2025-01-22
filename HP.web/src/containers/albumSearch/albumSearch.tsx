import { useState } from 'react';
import { TextField, Box, Container } from '@mui/material';
import Button from '@mui/material/Button';
import { AlbumSearchResults } from './components/albumSearchResults';

export const AlbumSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearch, setActualSearch] = useState('');

  const handleSearch = () => {
    setActualSearch(searchTerm);
  };

  return (
    <Container maxWidth={false} sx={{ height: '100vh' }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: 4, gap: 2, marginBottom: 4 }}
      >
        <TextField
          label="Search artist"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '50%' }}
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <AlbumSearchResults searchTerm={actualSearch} />
    </Container>
  );
};
