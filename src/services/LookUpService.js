import Api from "../api/Api";
import Cache from "../utilities/Cache";

const REGISTRY_URL = `${process.env.REGISTRY_URL}/lookup`;

const getPublicKey = async (type) => {
  const cachekey = `publicKey - ${type};`;
  const publicKey = await Cache.getCache(cachekey);
  if (publicKey) {
    console.log("The cached publicKey is:" + publicKey);
    return publicKey;
  }
  return lookUpPublicKey(cachekey, type);
};

const lookUpPublicKey = async (cachekey, type) => {
  const request = JSON.stringify({
    type: type,
  });

  const response = await Api.doPost(REGISTRY_URL, request);
  const responseJson = await response.json();
  Cache.setCache(cachekey, responseJson[0].signing_public_key);
  return responseJson[0].signing_public_key;
};

export default {
  getPublicKey,
};
