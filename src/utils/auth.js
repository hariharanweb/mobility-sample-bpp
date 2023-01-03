import sodium from 'libsodium-wrappers';
// import registry from '../registry/registry.json';
import LoggingService from '../services/LoggingService';

const logger = LoggingService.getLogger();

const getSignature = (headers) => {
  const signaturePart = split_auth_header(
    `${headers['x-gateway-authorization']}`,
  );
  return signaturePart.signature;
};

const getCreated = (headers) => {
  const signaturePart = split_auth_header(
    headers['x-gateway-authorization'],
  );
  return signaturePart.created;
};

const getExpires = (headers) => {
  const signaturePart = split_auth_header(
    headers['x-gateway-authorization'],
  );
  return signaturePart.expires;
};

const verify = (msg, publicKey, signature) => {
  console.log("In verify the msg, publickey, signature are " + msg + " " + publicKey + " " + signature);
  const verification = sodium.crypto_sign_verify_detached(
    sodium.from_base64(signature, sodium.base64_variants.ORIGINAL),
    msg,
    sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL),
  );
  console.log("The verification is " + verification);
  return verification;
};

const getPublicKey = () => {
  // const bapSubscriber = registry.filter(
  //   (entry) => entry.subscriber_id === 'sample_mobility_bap',
  // );
  // console.log(`bap subscriber ${JSON.stringify(bapSubscriber)}`);
  // const publicKey = `${bapSubscriber[0].signing_public_key}`;
  const publicKey = "hltijl/VTGurBGvqkkBFl1hcJzfc/ApunTMi8YwWGcA=";
  return publicKey;
};

const createSigningString = async (body, created, expires) => {
  await sodium.ready;
  const digest = sodium.crypto_generichash(64, sodium.from_string(JSON.stringify(body)));
  const digestBase64 = sodium.to_base64(
    digest,
    sodium.base64_variants.ORIGINAL,
  );
  const signingString = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digestBase64}`;
  return signingString;
};

const authorize = async (req) => {
  try {
    logger.debug(`The request header is ${JSON.stringify(req.headers)}`);
    const signature = getSignature(req.headers);
    logger.debug(`In AUTHORIZE: signature is.. ${signature}`);
    const created = getCreated(req.headers);
    logger.debug(`In AUTHORIZE: created is.. ${created}`);
    const expires = getExpires(req.headers);
    logger.debug(`In AUTHORIZE: expires is.. ${expires}`);
    if (typeof signature === 'undefined') {
      logger.error('Empty Signature in Header from BAP');
      // eslint-disable-next-line no-throw-literal
      throw 'Signature Field is Empty';
    }
    const publicKey = getPublicKey();
    const signingString = await createSigningString(
      req.body,
      created.toString(),
      expires.toString(),
    );
    const verification = verify(signingString, publicKey, signature);
    if (verification) {
      return verification;
    }
    // eslint-disable-next-line no-throw-literal
    throw 'Verification Failed';
  } catch (err) {
    logger.error(`Error Triggered: ${err}`);
    throw err;
  }
};

const split_auth_header = (auth_header) => {
  const header = auth_header.replace('Signature ', '');
  const re = /\s*([^=]+)=([^,]+)[,]?/g;
  let m;
  const parts = {};
  while ((m = re.exec(header)) !== null) {
    if (m) {
      parts[m[1]] = remove_quotes(m[2]);
    }
  }
  console.log("The parts are " + typeof(parts));
  return parts;
};
const remove_quotes = (value) => {
  if (value.length >= 2
    && value.charAt(0) == '"'
    && value.charAt(value.length - 1) == '"') {
    value = value.substring(1, value.length - 1);
  }
  return value;
};

export default {
  authorize,
};
