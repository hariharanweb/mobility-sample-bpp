import express from 'express';
import * as dotenv from 'dotenv';
import log4js from 'log4js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';
import SearchController from './controllers/SearchController';
import SelectController from './controllers/SelectController';
import ConfirmController from './controllers/ConfirmController';
import InitController from './controllers/InitController';
import StatusController from './controllers/StatusController';
import TrackController from './controllers/TrackController';
import SubscribeController from './controllers/SubscribeController';
import SignatureHelper from './utilities/SignVerify/SignatureHelper';

dotenv.config();
process.env.REQUEST_ID = uuid();

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
app.post('/subscribe', SubscribeController.subscribe);

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

app.listen(port, async () => {
  logger.info(`Sample BPP listening on port ${port}`);
  logger.info(`BPP request_id ${process.env.REQUEST_ID}`);
  await registerVerificationPage(app);
});
