import LoggingService from '../services/LoggingService';
import genericResponse from '../utilities/GenericResponse';

const onSubscribe = async (req, res) => {
  const logger = LoggingService.getLogger('OnSubscribeController');
  logger.debug(`on_subscribe called with ${JSON.stringify(req.body)}`);

  genericResponse.sendAcknowledgement(res);
};

export default {
  onSubscribe,
};
