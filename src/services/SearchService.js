import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';

dotenv.config();

const readResponse = () => {
  const mode = process.env.MODE ? process.env.MODE : 'ON_DEMAND_CABS';
  const jsonPath = path.join(process.cwd(), `src/fakeResponses/FakeOnSearchResponse_${mode}.json`);
  const response = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(response);
};

const search = async (request) => {
  const logger = LoggingService.getLogger('SearchService');
  const gatewayUrl = process.env.GATEWAY_URL;

  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: readResponse(),
  };
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 1000)); // delayed result
  const postReponse = await Api.doPost(`${gatewayUrl}/on_search`, JSON.stringify(response));
  const body = await postReponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  search,
};
