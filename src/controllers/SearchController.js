import log4js from 'log4js';
import SearchService from '../services/SearchService';

const search = (req, res) => {
  const logger = log4js.getLogger('SearchController');
  logger.debug(`Search called with ${JSON.stringify(req.body)}`);
  SearchService.search(req.body);
  res.send({
    message: {
      ack: {
        status: 'ACK',
      },
    },
  });
};

export default {
  search,
};
