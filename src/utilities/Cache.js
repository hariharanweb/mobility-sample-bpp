import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 120, checkperiod: 200000 });

const getCache = (cachekey) => cache.get(cachekey);

const setCache = (cachekey, cacheValue, ttl) => {
  cache.set(cachekey, cacheValue, ttl);
};

export default {
  getCache,
  setCache,
};
