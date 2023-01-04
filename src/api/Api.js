import fetch from 'node-fetch';
import LoggingService from '../services/LoggingService';
import authHeader from '../utilities/SignVerify/AuthHeader';

const doPost = async (url, body) => {
  const logger = LoggingService.getLogger('API');
  logger.debug(`Posting to ${url} with Content ${body}`);

  const privateKey = `${process.env.PRIVATE_KEY}`;
  const authHeaderValue = await authHeader
    .generateAuthorizationHeaderValue(body, privateKey);
  logger.debug(`Header Value: ${authHeaderValue}`);

  return fetch(url, {
    method: 'post',
    body: body,
    headers: {
      'X-Gateway-Authorization': authHeaderValue,
      'Content-Type': 'application/json',
    },
  });
};

export default {
  doPost,
};
