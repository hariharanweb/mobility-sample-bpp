import fetch from 'node-fetch';
import LoggingService from '../services/LoggingService';

const doPost = (url, body) => {
  const logger = LoggingService.getLogger('API');
  logger.debug(`Posting to ${url} with Content ${JSON.stringify(body)}`);
  return fetch(
    url,
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

export default {
  doPost,
};
