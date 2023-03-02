import SignatureHelper from './SignatureHelper';

const generateAuthorizationHeaderValue = async (body, privateKey) => {
  const createdAndExpiresValue = SignatureHelper.getCreatedAndExpires();
  const signature = await SignatureHelper.createSignature(body, createdAndExpiresValue, privateKey);
  return `Signature keyId="1001|UUID|ed25519",algorithm="ed25519",created="${createdAndExpiresValue[0]}",expires="${createdAndExpiresValue[1]}",headers="(created) (expires) digest",signature="${signature}"`;
};

export default {
  generateAuthorizationHeaderValue,
};
