import express from 'express';
import * as dotenv from 'dotenv';
import log4js from 'log4js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import SearchController from './controllers/SearchController';
import SelectController from './controllers/SelectController';
import ConfirmController from './controllers/ConfirmController';
import InitController from './controllers/InitController';
import StatusController from './controllers/StatusController';
import TrackController from './controllers/TrackController';
import SubscribeController from './controllers/SubscribeController';
// import SubscribeService from './services/SubscribeService';

dotenv.config();

const app = express();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
// const port = process.env.SELLER_APP_PORT ? process.env.SELLER_APP_PORT : 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

app.set('view engine', 'pug');
app.set('views', path.join(dirname, 'views'));
app.use(express.static(path.join(dirname, 'public')));

app.get('/tracking', (req, res) => {
  res.status(200).render('track', {
    apiKey: process.env.MAP_API_KEY,
  });
});

app.get('/', (req, res) => {
  res.send(`Sample BPP is running ${new Date()}`);
});

// eslint-disable-next-line no-console
console.log(process.env.MODE);
app.post('/search', SearchController.search);
app.post('/select', SelectController.select);
app.post('/confirm', ConfirmController.confirm);
app.post('/init', InitController.init);
app.post('/status', StatusController.status);
app.post('/track', TrackController.track);
app.post('/subscribe', SubscribeController.subscribe);

// app.listen(port, () => {
//   logger.info(`Sample BPP listening on port ${port}`);
// });

const server = http.createServer(app);
server.listen(0, () => {
  const portNumber = server.address().port;
  logger.info(`Sample BPP listening on port ${portNumber}`);
  process.env.SELLER_APP_PORT = portNumber;
  process.env.SELLER_APP_ID = `sample_mobility_bpp_${process.env.MODE}`;
  process.env.SELLER_APP_URL = `http://localhost:${portNumber}`;

  // console.log(process.env.SELLER_APP_PORT);
  // console.log(process.env.SELLER_APP_ID);
  // console.log(process.env.SELLER_APP_URL);
  // console.log(process.env.MODE);
  app.post('/subscribe', SubscribeController.subscribe);
  // SubscribeService.subscribe();
});
