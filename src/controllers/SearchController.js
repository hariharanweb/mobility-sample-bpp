import log4js from 'log4js';
import SearchService from '../services/SearchService';
import GenericResponse from './GenericResponse';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';

const search = async (req, res) => {
  const logger = log4js.getLogger('SearchController');
  logger.debug(`Search called with ${JSON.stringify(req.body)}`);

  const publicKey = await GenericResponse.getPublicKey('BG');
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
