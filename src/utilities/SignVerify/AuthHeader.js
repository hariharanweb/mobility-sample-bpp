import LoggingService from '../../services/LoggingService';
import SignatureHelper from './SignatureHelper';

const generateAuthorizationHeaderValue = async (body, privateKey) => {
  const logger = LoggingService.getLogger('AuthHeader');
  logger.debug(`Creating Authorization Header for ${body}`);

  const createdAndExpiresValue = SignatureHelper.getCreatedAndExpires();
  logger.debug(`Created Value: ${createdAndExpiresValue[0]}, Expires Value :
  ${createdAndExpiresValue[1]}`);

  const signature = await SignatureHelper.createSignature(body, createdAndExpiresValue, privateKey);
  logger.debug(`Signature Value ${signature}`);

  const header = `Signature keyId="1001|UUID|ed25519",algorithm="ed25519",created="${createdAndExpiresValue[0]}",expires="${createdAndExpiresValue[1]}",headers="(created) (expires) digest",signature="${signature}"`;
  logger.debug(`Header value ${header}`);
  return header;
};

export default {
  generateAuthorizationHeaderValue,
};
