import log4js from 'log4js';
import GenericResponse from '../utilities/GenericResponse';
import SelectService from '../services/SelectService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import LookUpService from '../services/LookUpService';

const select = async (req, res) => {
  const logger = log4js.getLogger('SelectController');
  logger.debug(`Select called with ${JSON.stringify(req.body)}`);
  const publicKey = await LookUpService.getPublicKey('BAP');
  authVerifier.authorize(req, publicKey).then(() => {
    logger.debug('Request Authorized Successfully.');
    SelectService.select(req.body);
    GenericResponse.sendAcknowledgement(res);
  }).catch((err) => {
    logger.debug(`Authorization Failed: ${err}`);
    GenericResponse.sendErrorWithAuthorization(res);
  });
};

export default {
  select,
};
