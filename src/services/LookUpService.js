import Api from '../api/Api';

const REGISTRY_URL = `${process.env.GATEWAY_URL}/lookup`;

const getPublicKey = async (type) => {
  const request = JSON.stringify({
    type,
  });

  const response = await Api.doPost(REGISTRY_URL, request);
  const responseJson = await response.json();
  return responseJson[0].signing_public_key;
};
const getPublicKeyWithUkId = async (ukId) => {
  const request = JSON.stringify({
    ukId,
  });

  const response = await Api.doPost(REGISTRY_URL, request);
  const responseJson = await response.json();
  return responseJson[0].signing_public_key;
};

export default {
  getPublicKey,
  getPublicKeyWithUkId,
};
