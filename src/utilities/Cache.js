import NodeCache from 'node-cache';
import LoggingService from '../services/LoggingService';

const cache = new NodeCache({ stdTTL: 200000, checkperiod: 200000 });
const logger = LoggingService.getLogger('Cache');

const getCache = (cachekey) => {
  logger.debug(`Inside get chache, the public key is: ${cache.get(cachekey)}`);
  return cache.get(cachekey);
};

const setCache = (cachekey, publicKey) => {
  logger.debug('Setting the cache');
  cache.set(cachekey, publicKey);
};

export default {
  getCache,
  setCache,
};
