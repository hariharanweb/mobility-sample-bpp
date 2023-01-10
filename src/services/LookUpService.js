import Api from '../api/Api';
import Cache from '../utilities/Cache';
import LoggingService from './LoggingService';

const REGISTRY_URL = `${process.env.REGISTRY_URL}/lookup`;
const logger = LoggingService.getLogger('LookUpService');

const lookUpPublicKey = async (ukId) => {
  const request = JSON.stringify({
    ukId,
  });
  const response = await Api.doPost(REGISTRY_URL, request);
  const responseJson = await response.json();
  logger.debug(`the looked up publickey is: ${responseJson[0].signing_public_key}`);
  return responseJson[0].signing_public_key;
};

const getPublicKey = async (ukId) => {
  const cachekey = `publicKey - ${ukId};`;
  const publicKey = await Cache.getCache(cachekey);
  if (publicKey) {
    return publicKey;
  }
  const publicKeyFromLookUp = await lookUpPublicKey(ukId);
  Cache.setCache(cachekey, publicKeyFromLookUp, 200000);
  logger.debug(`the public key is: ${publicKeyFromLookUp}`);
  return publicKeyFromLookUp;
};

export default {
  getPublicKey,
};
