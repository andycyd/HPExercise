import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import logo from '/hpLogo.png';

export const Header = () => {
    return (
        <AppBar position="fixed" sx={{ width: '100%', backgroundColor: '#333' }}>
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Logo />
                    <Title />
                </Toolbar>
            </Container>
        </AppBar>
    );
};

function Logo() {
    return <img src={logo} className="logo" alt="HP logo" width={"50px"} />;
}

function Title() {
    return (
        <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                marginLeft: '10px',
            }}
        >
            Fullstack exercise
        </Typography>
    );
}
