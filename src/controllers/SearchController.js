import log4js from 'log4js';
import SearchService from '../services/SearchService';
import Utils from '../utils/Utils';
import auth from '../utils/auth';
 
const search = (req, res) => {
  const logger = log4js.getLogger('SearchController');
  logger.debug(`Search called with ${JSON.stringify(req.body)}`);

  const authorization = auth.authorize(req);

  if(authorization){
    SearchService.search(req.body);
    res.send(Utils.successfulAck);
  }
  else{
    res.status(401).send("Error");
  }

};

export default {
  search,
};
