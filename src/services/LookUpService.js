/* eslint-disable camelcase */
import Api from '../api/Api';
import Cache from '../utilities/Cache';
import LoggingService from './LoggingService';

const logger = LoggingService.getLogger('LookUpService');
const REGISTRY_URL = `${process.env.REGISTRY_URL}/lookup`;

const lookUpPublicKey = async (request) => {
  const response = await Api.doPost(REGISTRY_URL, request);
  const responseJson = await response.json();
  logger.debug(`the looked up publickey is: ${responseJson[0].signing_public_key}`);
  return responseJson[0].signing_public_key;
};
const getPublicKeyWithSubscriberId = async (subscriber_id) => {
  const cachekey = `publicKey - ${subscriber_id};`;
  const publicKey = await Cache.getCache(cachekey);
  if (publicKey) {
    return publicKey;
  }
  const request = JSON.stringify({
    subscriber_id,
  });

  const publicKeyFromLookUp = await lookUpPublicKey(request);
  Cache.setCache(cachekey, publicKeyFromLookUp, 200000);
  logger.debug(`the public key is: ${publicKeyFromLookUp}`);
  return publicKeyFromLookUp;
};

const getPublicKey = async (type) => {
  const cachekey = `publicKey - ${type};`;
  const publicKey = await Cache.getCache(cachekey);
  if (publicKey) {
    return publicKey;
  }
  const request = JSON.stringify({
    type,
  });
  const publicKeyFromLookUp = await lookUpPublicKey(request);
  Cache.setCache(cachekey, publicKeyFromLookUp, 200000);
  logger.debug(`the public key is: ${publicKeyFromLookUp}`);
  return publicKeyFromLookUp;
};

const getProviderId = async (type, subscriber_id) => {
  const request = JSON.stringify({
    type,
    subscriber_id,
  });
  const response = await Api.doPost(REGISTRY_URL, request);
  const responseJson = await response.json();
  logger.debug(`the looked up Provide id is: ${responseJson[0].ukId}`);
  return responseJson[0].ukId;
};

export default {
  getPublicKey,
  getPublicKeyWithSubscriberId,
  getProviderId,
};
