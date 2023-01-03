import fetch from 'node-fetch';
import LoggingService from '../services/LoggingService';
import authHeader from '../utilities/SignVerify/AuthHeader';

const doPost = async (url, bodyValue) => {
  const logger = LoggingService.getLogger('API');
  logger.debug(`Posting to ${url} with Content ${bodyValue}`);

  const privateKey = `${process.env.privateKey}`;
  const authHeaderValue = await authHeader
    .generateAuthorizationHeaderValue(bodyValue, privateKey);
  logger.debug(`Header Value: ${authHeaderValue}`);

  return fetch(url, {
    method: 'post',
    body: bodyValue,
    headers: {
      'X-Gateway-Authorization': authHeaderValue,
      'Content-Type': 'application/json',
    },
  });
};

export default {
  doPost,
};
