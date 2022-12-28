import log4js from 'log4js';
import GenericResponse from '../utilities/GenericResponse';
import SelectService from '../services/SelectService';

const select = (req, res) => {
  const logger = log4js.getLogger('SelectController');
  logger.debug(`Select called with ${JSON.stringify(req.body)}`);

  SelectService.select(req.body);
  GenericResponse.sendAcknowledgement(res);
};

export default {
  select,
};
