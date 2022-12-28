import sodium from "libsodium-wrappers";
import LoggingService from "../services/LoggingService";

const logger = LoggingService.getLogger();

const getSignature = (headers) => {
  const authorizationHeader = getAuthorizationHeader(
    headers["x-gateway-authorization"]
  );
  const leng = authorizationHeader.signature.length;
  logger.debug(authorizationHeader.signature.slice(1, leng));
  return authorizationHeader.signature.slice(1, leng);
};

const getCreated = (headers) => {
  const authorizationHeader = getAuthorizationHeader(
    headers["x-gateway-authorization"]
  );
  const leng = authorizationHeader.created.length;
  logger.debug(authorizationHeader.created.slice(1, leng - 1));
  return authorizationHeader.created.slice(1, leng - 1);
};

const getExpires = (headers) => {
  const authorizationHeader = getAuthorizationHeader(
    headers["x-gateway-authorization"]
  );
  const leng = authorizationHeader.expires.length;
  logger.debug(authorizationHeader.expires.slice(1, leng));
  return authorizationHeader.expires.slice(1, leng - 1);
};

const verify = (msg, publicKey, signature) => {
  const verification = sodium.crypto_sign_verify_detached(
    sodium.to_base64(signature, sodium.base64_variants.ORIGINAL),
    msg,
    sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL)
  );
  return verification;
};

const getPublicKey = () => {
//   const bapSubscriber = registry.filter(
//     (entry) => entry.subscriber_id === "sample_mobility_bap"
//   );
//   console.log("bap subscriber " + JSON.stringify(bapSubscriber));
//   const publicKey = `${bapSubscriber[0].signing_public_key}`;
    const publicKey = "2AlBFWVAeJrumoMYeGxX/BpCxU/Xur4hIcTXcEE+DtY="
  return publicKey;
};

const createSigningString = async (body, created, expires) => {
  await sodium.ready;
  const digest = sodium.crypto_generichash(64, sodium.from_string(body));
  const digestBase64 = sodium.to_base64(
    digest,
    sodium.base64_variants.ORIGINAL
  );
  const signingString = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digestBase64}`;
  return signingString;
};

const authorize = async (req) => {
  logger.debug(`The request header is ${JSON.stringify(req.headers)}`);
  const signature = getSignature(req.headers);
  const created = getCreated(req.headers);
  const expires = getExpires(req.headers);
  if (typeof signature === "undefined") {
    return false;
  }
  const msg = JSON.stringify(req.body);
  const publicKey = getPublicKey();
  const signingString = await createSigningString(
    msg,
    created.toString(),
    expires.toString()
  );
  return verify(signingString, publicKey, signature);
};

const getAuthorizationHeader = (authorizationHeader) => {
  logger.debug(`Authorization header: ${authorizationHeader}`);
  const headerElements = authorizationHeader.split(",");
  if (!headerElements || Object.keys(headerElements).length === 0) {
    throw new Error("Header parsing failed");
  }
  const header = {};
  for (let i = 0; i < headerElements.length; i++) {
    const temp = headerElements[i].split("=");
    header[temp[0]] = temp[1];
  }
  logger.debug(header);
  return header;
};

export default {
  authorize,
};