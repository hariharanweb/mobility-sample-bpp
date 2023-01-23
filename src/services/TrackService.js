import * as dotenv from 'dotenv';;
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';

dotenv.config();

const track = async (request) => {
  const data = {
    order: {
      ...request.message.order,
      fulfillment: {
        ...request.message.order.fulfillment,
      },
    },
  };
  const logger = LoggingService.getLogger('TrackService');
  logger.debug(JSON.stringify(request));
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: data,
  };
  const url = `${request.context.bap_uri}/on_track`;
  const postResponse = await Api.doPost(url, JSON.stringify(response));
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  track,
};
