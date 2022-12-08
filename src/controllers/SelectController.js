import log4js from 'log4js';
import Utils from '../utils/Utils';

const select = (req, res) => {
  const logger = log4js.getLogger('SelectController');
  logger.debug(`Select called with ${JSON.stringify(req.body)}`);
  res.send(Utils.successfulAck);
};

export default {
  select,
};
