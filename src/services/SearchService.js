import fetch from 'node-fetch';
import log4js from 'log4js';
import FakeOnSearchResponse from './FakeOnSearchResponse.json';

const search = async (request) => {
  const logger = log4js.getLogger('SearchService');
  const bapUri = request.context.bap_uri;
  const response = {
    context: request.context,
    message: FakeOnSearchResponse,
  };
  const postReponse = await fetch(`${bapUri}on_search`, {method: 'POST', body: response});
  logger.debug(`Response ${JSON.stringify(postReponse)}`);
};

export default {
  search,
};
