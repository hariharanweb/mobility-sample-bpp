import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 200000, checkperiod: 200000 });

const getCache = (cachekey) => {
    console.log("Getting public key from cache");
    return cache.get(cachekey);
  };

const setCache = (cachekey, publicKey) => {
    console.log("Setting the Cache");
    cache.set(cachekey, publicKey);
};

export default {
    getCache,
    setCache
}