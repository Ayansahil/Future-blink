import 'dotenv/config';
import connectDB from './src/config/database.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server startup error:', err);
  });