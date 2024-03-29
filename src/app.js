import express from 'express';
import * as dotenv from 'dotenv';
import log4js from 'log4js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import rando from 'random-number-in-range';
import SearchController from './controllers/SearchController';
import SelectController from './controllers/SelectController';
import ConfirmController from './controllers/ConfirmController';
import InitController from './controllers/InitController';
import StatusController from './controllers/StatusController';
import TrackController from './controllers/TrackController';
import SubscribeController from './controllers/SubscribeController';
import SubscribeService from './services/SubscribeService';
import SignatureHelper from './utilities/SignVerify/SignatureHelper';
import OnSubscribeController from './controllers/OnSubscribeController';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const envFileToConsider = (process.env.MODE === 'cabs') ? 'local.env.cabs' : 'local.env.trains';
dotenv.config({ path: path.resolve(process.cwd(), `${envFileToConsider}`), override: true });

process.env.REQUEST_ID = uuid();
const app = express();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.post('/subscribe', SubscribeController.subscribe);
app.post('/on_subscribe', OnSubscribeController.onSubscribe);

const registerVerificationPage = async (application) => {
  application.get('/ondc-site-verification.html', async (req, res) => {
    const signedRequestId = await SignatureHelper.createSignedData(
      process.env.REQUEST_ID,
      process.env.PRIVATE_KEY,
    );
    res.status(200).render('ondc-site-verification', {
      SIGNED_UNIQUE_REQ_ID: signedRequestId,
    });
  });
};

const portNumber = rando(32000, 65536);

app.listen(portNumber, async () => {
  logger.info(`Sample BPP listening on port ${portNumber}`);
  process.env.SELLER_APP_PORT = portNumber;
  process.env.SELLER_APP_ID = `sample_mobility_bpp_${process.env.MODE}`;
  process.env.SELLER_APP_URL = `http://localhost:${portNumber}`;
  SubscribeService.subscribe();
  logger.info(`BPP request_id ${process.env.REQUEST_ID}`);
  await registerVerificationPage(app);
});
