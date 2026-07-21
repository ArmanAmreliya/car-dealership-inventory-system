import dotenv from 'dotenv';
import path from 'path';
import app from './app/app';

dotenv.config({ path: path.join(__dirname, '../.env') });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
