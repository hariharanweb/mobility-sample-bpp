import log4js from 'log4js';
import SearchService from '../services/SearchService';
import Utils from '../utils/Utils';
import auth from '../utils/auth';
 
const search = (req, res) => {
  const logger = log4js.getLogger('SearchController');
  logger.debug(`Search called with ${JSON.stringify(req.body)}`);

  logger.debug('Before Authorize call');
  auth.authorize(req).then((x) => {
    logger.debug('On Fullfilled Promise of Authorize call');
    SearchService.search(req.body);
    res.send(Utils.successfulAck);
  }).catch((err) => {
    logger.debug('On Rejected Promise of Authorize call');
    res.status(401).send('Error');
  });

};

export default {
  search,
};
