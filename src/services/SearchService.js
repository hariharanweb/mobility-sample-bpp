import fetch from 'node-fetch';
import log4js from 'log4js';
import FakeOnSearchResponse from './FakeOnSearchResponse.json';
import ContextBuilder from '../utilities/ContextBuilder';

const search = async (request) => {
  const logger = log4js.getLogger('SearchService');
  const bapUri = request.context.bap_uri;
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: FakeOnSearchResponse,
  };
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const postReponse = await fetch(
    `${bapUri}/on_search`,
    { method: 'post', body: JSON.stringify(response), headers: { 'Content-Type': 'application/json' } },
  );
  const body = await postReponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  search,
};
