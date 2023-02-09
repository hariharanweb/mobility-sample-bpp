import log4js from 'log4js';
import GenericResponse from '../utilities/GenericResponse';
import InitService from '../services/InitService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import LookUpService from '../services/LookUpService';

const init = async (req, res) => {
  const logger = log4js.getLogger('InitController');
  logger.debug(`Init called with ${JSON.stringify(req.body)}`);
  const publicKey = await LookUpService.getPublicKeyWithSubscriberId(req.body.context.bap_id);
  await authVerifier.authorize(req, publicKey).then(() => {
    logger.debug('Request Authorized Successfully.');
    InitService.init(req.body);
    GenericResponse.sendAcknowledgement(res);
  }).catch((err) => {
    logger.debug(`Authorization Failed: ${err}`);
    GenericResponse.sendErrorWithAuthorization(res);
  });
};

export default {
  init,
};
