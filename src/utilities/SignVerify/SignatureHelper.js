import sodium from 'libsodium-wrappers';
import LoggingService from '../../services/LoggingService';
import AuthHeaderSplitter from './AuthHeaderSplitter';

const logger = LoggingService.getLogger('SignatureHelper');

const getCreatedAndExpires = () => {
  const created = Math.floor(
    new Date().getTime() / 1000 - 1 * 60,
  ).toString();
  const expires = (
    parseInt(created, 10) + 1 * 60 * 60).toString();

  logger.debug(`Created at ${created}, Expires at ${expires}`);
  return [created, expires];
};

const concatinateSignature = (created, expires, digestBase64) => `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digestBase64}`;

const createSignature = async (body, createdAndExpiresValue, privateKey) => {
  await sodium.ready;
  const digest = sodium.crypto_generichash(64, sodium.from_string(body));
  const digestBase64 = sodium.to_base64(digest, sodium.base64_variants.ORIGINAL);
  const signingString = concatinateSignature(
    createdAndExpiresValue[0],
    createdAndExpiresValue[1],
    digestBase64,
  );
  logger.debug(`Digest Base 64: ${digestBase64}`);
  logger.debug(`Signing String : ${signingString}`);

  const signedMessage = sodium.crypto_sign_detached(
    signingString,
    sodium.from_base64(privateKey, sodium.base64_variants.ORIGINAL),
  );
  const signedMessageBase64 = sodium.to_base64(signedMessage, sodium.base64_variants.ORIGINAL);
  logger.debug(`Signed Message: ${signedMessageBase64}`);
  return signedMessageBase64;
};

const getSignature = (headers) => {
  const signaturePart = AuthHeaderSplitter.splitAuthHeader(
    `${headers['x-gateway-authorization']}`,
  );
  logger.debug(signaturePart.signature);
  return signaturePart.signature;
};

const getCreated = (headers) => {
  const signaturePart = AuthHeaderSplitter.splitAuthHeader(
    headers['x-gateway-authorization'],
  );
  logger.debug(signaturePart.created);
  return signaturePart.created;
};

const getExpires = (headers) => {
  const signaturePart = AuthHeaderSplitter.splitAuthHeader(
    headers['x-gateway-authorization'],
  );
  logger.debug(signaturePart.expires);
  return signaturePart.expires;
};

const createSigningStringUsingTime = async (body, created, expires) => {
  await sodium.ready;
  const digest = sodium.crypto_generichash(64, sodium.from_string(JSON.stringify(body)));
  const digestBase64 = sodium.to_base64(
    digest,
    sodium.base64_variants.ORIGINAL,
  );
  logger.debug(`Digest Base 64: ${digestBase64}`);
  const signingString = concatinateSignature(
    created,
    expires,
    digestBase64,
  );
  logger.debug(`Signing String : ${signingString}`);

  return signingString;
};

export default {
  createSignature,
  getCreatedAndExpires,
  getSignature,
  getCreated,
  getExpires,
  createSigningStringUsingTime,
};
