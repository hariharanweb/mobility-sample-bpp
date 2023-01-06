import NodeCache from 'node-cache';
import LoggingService from '../services/LoggingService';

const cache = new NodeCache({ stdTTL: 120, checkperiod: 200000 });
const logger = LoggingService.getLogger('Cache');

const getCache = (cachekey) => {
  logger.debug(`Inside get chache, the public key is: ${cache.get(cachekey)}`);
  return cache.get(cachekey);
};

const setCache = (cachekey, publicKey, ttl) => {
  cache.set(cachekey, publicKey, ttl);
  logger.debug(`Inside set chache, the public key is: ${cache.get(cachekey)}`);
};

export default {
  getCache,
  setCache,
};
