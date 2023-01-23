import log4js from 'log4js';
import GenericResponse from '../utilities/GenericResponse';
import TrackService from '../services/TrackService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import LookUpService from '../services/LookUpService';

const track = async (req, res) => {
  const logger = log4js.getLogger('TrackController');
  logger.debug(`Track called with ${JSON.stringify(req.body)}`);
  const publicKey = await LookUpService.getPublicKeyWithSubscriberId(req.body.context.bap_id);
  authVerifier.authorize(req, publicKey).then(() => {
    logger.debug('Request Authorized Successfully.');
    TrackService.track(req.body);
    GenericResponse.sendAcknowledgement(res);
  }).catch((err) => {
    logger.debug(`Authorization Failed: ${err}`);
    GenericResponse.sendErrorWithAuthorization(res);
  });
};

export default {
   track,
};
