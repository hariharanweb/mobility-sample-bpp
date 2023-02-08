import LoggingService from '../../services/LoggingService';
import SignatureHelper from './SignatureHelper';

const logger = LoggingService.getLogger();

const authorize = async (req, publicKey) => {
  try {
    logger.debug(`The request header is ${JSON.stringify(req.headers)}`);

    const signature = SignatureHelper.getSignature(req.headers);
    if (typeof signature === 'undefined') {
      logger.error('Empty Signature in Header from BAP');
      throw Error('Signature Field is Empty');
    }
    const signingString = await SignatureHelper.createSigningStringUsingTime(
      req.body,
      SignatureHelper.getCreated(req.headers).toString(),
      SignatureHelper.getExpires(req.headers).toString(),
    );

    if (SignatureHelper.verify(signingString, publicKey, signature)) {
      return true;
    }
    throw Error('Verification Failed');
  } catch (err) {
    logger.error(`Error Triggered: ${err}`);
    throw err;
  }
};

export default {
  authorize,
};
