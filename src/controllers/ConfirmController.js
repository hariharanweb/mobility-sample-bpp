import log4js from 'log4js';
import GenericResponse from '../utilities/GenericResponse';
import ConfirmService from '../services/ConfirmService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import LookUpService from '../services/LookUpService';

const confirm = async (req, res) => {
  const logger = log4js.getLogger('ConfirmController');
  logger.debug(`Confirm called with ${JSON.stringify(req.body)}`);
  const publicKey = await LookUpService.getPublicKeyWithSubscriberId(req.body.context.bap_id);
  await authVerifier.authorize(req, publicKey).then(() => {
    logger.debug('Request Authorized Successfully.');
    ConfirmService.confirm(req.body);
    GenericResponse.sendAcknowledgement(res);
  }).catch((err) => {
    logger.debug(`Authorization Failed: ${err}`);
    GenericResponse.sendErrorWithAuthorization(res);
  });
};

export default {
  confirm,
};
