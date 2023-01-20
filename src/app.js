import express from 'express';
import * as dotenv from 'dotenv';
import log4js from 'log4js';
import SearchController from './controllers/SearchController';
import SelectController from './controllers/SelectController';
import ConfirmController from './controllers/ConfirmController';
import InitController from './controllers/InitController';

dotenv.config();

const app = express();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
const port = process.env.SELLER_APP_PORT ? process.env.SELLER_APP_PORT : 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`Sample BPP is running ${new Date()}`);
});

app.post('/search', SearchController.search);
app.post('/select', SelectController.select);
app.post('/confirm', ConfirmController.confirm);
app.post('/init', InitController.init);

app.listen(port, () => {
  logger.info(`Sample BPP listening on port ${port}`);
});
