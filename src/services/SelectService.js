import * as dotenv from 'dotenv';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';
import FakeOnSelectResponse from './FakeOnSelectResponse.json';

dotenv.config();

const select = async (request) => {
  const logger = LoggingService.getLogger('SelectService');
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: FakeOnSelectResponse,
  };
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 3000)); // delayed result
  const url = `${request.context.bap_uri}/on_select`;

  const postResponse = await Api.doPost(url, response);
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  select,
};
