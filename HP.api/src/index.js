const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const albumRoutes = require('./routes/albumsRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', albumRoutes);

app.get('/', (req, res) => {
  res.send('HP Exercise api');
});

app.use((err, req, res, next) => {
  console.error({ request: req, error: err });
  res.status(500).json({ message: 'An internal server error occurred' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
