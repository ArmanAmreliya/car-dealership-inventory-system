import app from './app/app';
import { env } from './config/env';

const port = env.PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
