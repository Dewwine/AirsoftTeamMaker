import app from './app';

// Load enviroment variables
require('dotenv').config();

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
