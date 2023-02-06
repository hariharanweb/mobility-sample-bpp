import log4js from 'log4js';
import GenericResponse from '../utilities/GenericResponse';
import StatusService from '../services/StatusService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import LookUpService from '../services/LookUpService';

const status = async (req, res) => {
  const logger = log4js.getLogger('StatusController');
  logger.debug(`Status called with ${JSON.stringify(req.body)}`);
  const publicKey = await LookUpService.getPublicKeyWithSubscriberId(req.body.context.bap_id);
  await authVerifier.authorize(req, publicKey).then(() => {
    logger.debug('Request Authorized Successfully.');
    StatusService.status(req.body);
    GenericResponse.sendAcknowledgement(res);
  }).catch((err) => {
    logger.debug(`Authorization Failed: ${err}`);
    GenericResponse.sendErrorWithAuthorization(res);
  });
};

export default {
  status,
};
