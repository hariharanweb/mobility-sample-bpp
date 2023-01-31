import express from 'express';
import * as dotenv from 'dotenv';
import log4js from 'log4js';
import path from 'path';
import { fileURLToPath } from 'url';
import SearchController from './controllers/SearchController';
import SelectController from './controllers/SelectController';
import ConfirmController from './controllers/ConfirmController';
import InitController from './controllers/InitController';
import StatusController from './controllers/StatusController';
import TrackController from './controllers/TrackController';

dotenv.config();

const app = express();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
const port = process.env.SELLER_APP_PORT ? process.env.SELLER_APP_PORT : 3010;

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

app.post('/search', SearchController.search);
app.post('/select', SelectController.select);
app.post('/confirm', ConfirmController.confirm);
app.post('/init', InitController.init);
app.post('/status', StatusController.status);
app.post('/track', TrackController.track);

app.listen(port, () => {
  logger.info(`Sample BPP listening on port ${port}`);
});
