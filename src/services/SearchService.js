import * as dotenv from 'dotenv';
import FakeOnSearchResponse from './FakeOnSearchResponse.json';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';

dotenv.config();

const search = async (request) => {
  const logger = LoggingService.getLogger('SearchService');
  const gatewayUrl = process.env.GATEWAY_URL;
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: FakeOnSearchResponse,
  };
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 3000)); // delayed result
  const postReponse = await Api.doPost(`${gatewayUrl}/on_search`, response);
  const body = await postReponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  search,
};
