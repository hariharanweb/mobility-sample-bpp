import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';
import LookUpService from './LookUpService';

dotenv.config();

const readResponse = () => {
  const mode = process.env.MODE ? process.env.MODE : 'CABS';
  const jsonPath = path.join(process.cwd(), `src/fakeResponses/FakeOnSearchResponse_${mode}.json`);
  const response = fs.readFileSync(jsonPath, 'utf8');
  return JSON.parse(response);
};

const search = async (request) => {
  const logger = LoggingService.getLogger('SearchService');
  const gatewayUrl = process.env.GATEWAY_URL;
  const providerId = await LookUpService.getProviderId('BPP', process.env.SELLER_APP_ID);
  logger.debug(`\n The provider id is ${JSON.stringify(providerId)}`);
  const fakeOnSearchResponsebody = readResponse();
  fakeOnSearchResponsebody.catalog['bpp/fulfillments'][0].start = request.message.intent.fulfillment.start;
  fakeOnSearchResponsebody.catalog['bpp/fulfillments'][0].end = request.message.intent.fulfillment.end;
  fakeOnSearchResponsebody.catalog['bpp/providers'][0].id = providerId;
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: fakeOnSearchResponsebody,
  };
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 1000)); // delayed result
  const postReponse = await Api.doPost(`${gatewayUrl}/on_search`, JSON.stringify(response));
  logger.debug(postReponse);
  const body = await postReponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  search,
};
