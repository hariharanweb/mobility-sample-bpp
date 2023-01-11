import log4js from 'log4js';
import SearchService from '../services/SearchService';
import GenericResponse from '../utilities/GenericResponse';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import LookUpService from '../services/LookUpService';

const search = async (req, res) => {
  const logger = log4js.getLogger('SearchController');
  logger.debug(`Search called with ${JSON.stringify(req.body)}`);
  const BecknGateway = 'BG';

  const publicKey = await LookUpService.getPublicKey(BecknGateway);
  authVerifier.authorize(req, publicKey).then(() => {
    logger.debug('Request Authorized Successfully.');
    SearchService.search(req.body);
    GenericResponse.sendAcknowledgement(res);
  }).catch((err) => {
    logger.debug(`Authorization Failed: ${err}`);
    GenericResponse.sendErrorWithAuthorization(res);
  });
};

export default {
  search,
};
