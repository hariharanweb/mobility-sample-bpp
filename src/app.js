import express from 'express';
import log4js from 'log4js';
import SearchController from './controllers/SearchController';

const app = express();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
const port = process.env.GATEWAY_PORT ? process.env.GATEWAY_PORT : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`Sample BPP is running ${new Date()}`);
});

app.post('/search', SearchController.search);

app.listen(port, () => {
  logger.info(`Sample BPP listening on port ${port}`);
});
