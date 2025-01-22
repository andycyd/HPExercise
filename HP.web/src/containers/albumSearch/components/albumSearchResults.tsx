import { useState } from "react";
import { Album, useAlbumSearch } from "../hooks/useAlbumSearch";
import { Box, Button, Card, CardContent, CardMedia, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';

export type AlbumSearchResultsProps = {
    searchTerm: string;
};

export const AlbumSearchResults = ({ searchTerm }: AlbumSearchResultsProps) => {
    const [albums, setAlbums] = useState<Album[]>([]);
    useAlbumSearch(searchTerm, setAlbums);

    const [filterTerm, setfilterTerm] = useState('');

    const handleFilter = () => {
        const filteredAlbums = albums.filter(album => 
            album.title.toLowerCase().includes(filterTerm.toLowerCase())
        );
        setAlbums(filteredAlbums);
    };

    return (
        <>
            {albums.length > 0 && 
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: 4, gap: 2, marginBottom: 4 }}
            >
                <TextField
                    label="Album title"
                    variant="outlined"
                    value={filterTerm}
                    onChange={(e) => setfilterTerm(e.target.value)}
                    sx={{ width: '50%' }}
                />
                <Button variant="contained" onClick={handleFilter}>Filter</Button>
            </Box>
            }
        <Grid container spacing={2}>
        {albums.map((album) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                <Card key={album.title} sx={{ height: '100%' }}>
                    <CardMedia
                        component="img"
                        alt={album.title}
                        height="200"
                        image={album.artwork}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                            <Box component="div" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal' }}>
                                {album.title}
                            </Box>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {album.artist}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {album.genre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {(new Date(album.releaseDate)).toLocaleDateString()}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ))}
        </Grid>
        </>
    );
};