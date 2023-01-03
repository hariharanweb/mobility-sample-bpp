import sodium from 'libsodium-wrappers';
import LoggingService from '../../services/LoggingService';
import SignatureHelper from './SignatureHelper';

const logger = LoggingService.getLogger();

const verify = (msg, publicKey, signature) => {
  const verification = sodium.crypto_sign_verify_detached(
    sodium.from_base64(signature, sodium.base64_variants.ORIGINAL),
    msg,
    sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL),
  );
  return verification;
};

const authorize = async (req, publicKey) => {
  try {
    logger.debug(`The request header is ${JSON.stringify(req.headers)}`);

    const signature = SignatureHelper.getSignature(req.headers);
    if (typeof signature === 'undefined') {
      logger.error('Empty Signature in Header from BAP');
      // eslint-disable-next-line no-throw-literal
      throw 'Signature Field is Empty';
    }
    const signingString = await SignatureHelper.createSigningStringUsingTime(
      req.body,
      SignatureHelper.getCreated(req.headers).toString(),
      SignatureHelper.getExpires(req.headers).toString(),
    );

    if (verify(signingString, publicKey, signature)) {
      return true;
    }
    // eslint-disable-next-line no-throw-literal
    throw 'Verification Failed';
  } catch (err) {
    logger.error(`Error Triggered: ${err}`);
    throw err;
  }
};

export default {
  authorize,
};
