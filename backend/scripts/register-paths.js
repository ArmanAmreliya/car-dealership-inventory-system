const tsconfigPaths = require('tsconfig-paths');
const path = require('path');

const baseUrl = path.resolve(__dirname, '../dist');
tsconfigPaths.register({
  baseUrl,
  paths: {
    '@app/*': ['./app/*'],
    '@config/*': ['./config/*'],
    '@common/*': ['./common/*'],
    '@routes/*': ['./routes/*'],
    '@middleware/*': ['./middleware/*'],
    '@domain/*': ['./domain/*'],
    '@infrastructure/*': ['./infrastructure/*'],
  },
});
